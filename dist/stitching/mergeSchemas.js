"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var schemaGenerator_1 = require("../schemaGenerator");
var schemaRecreation_1 = require("./schemaRecreation");
var delegateToSchema_1 = require("./delegateToSchema");
var typeFromAST_1 = require("./typeFromAST");
var transforms_1 = require("../transforms");
var mergeDeep_1 = require("../mergeDeep");
function mergeSchemas(_a) {
    var schemas = _a.schemas, onTypeConflict = _a.onTypeConflict, resolvers = _a.resolvers;
    var visitType = defaultVisitType;
    if (onTypeConflict) {
        console.warn('`onTypeConflict` is deprecated. Use schema transforms to customize merging logic.');
        visitType = createVisitTypeFromOnTypeConflict(onTypeConflict);
    }
    return mergeSchemasImplementation({ schemas: schemas, visitType: visitType, resolvers: resolvers });
}
exports.default = mergeSchemas;
function mergeSchemasImplementation(_a) {
    var schemas = _a.schemas, visitType = _a.visitType, resolvers = _a.resolvers;
    var allSchemas = [];
    var typeCandidates = {};
    var types = {};
    var extensions = [];
    var fragments = [];
    if (!visitType) {
        visitType = defaultVisitType;
    }
    var resolveType = schemaRecreation_1.createResolveType(function (name) {
        if (types[name] === undefined) {
            throw new Error("Can't find type " + name + ".");
        }
        return types[name];
    });
    var createNamedStub = function (name, type) {
        var constructor;
        if (type === 'object') {
            constructor = graphql_1.GraphQLObjectType;
        }
        else if (type === 'interface') {
            constructor = graphql_1.GraphQLInterfaceType;
        }
        else {
            constructor = graphql_1.GraphQLInputObjectType;
        }
        return new constructor({
            name: name,
            fields: {
                __fake: {
                    type: graphql_1.GraphQLString,
                },
            },
        });
    };
    schemas.forEach(function (schema) {
        if (schema instanceof graphql_1.GraphQLSchema) {
            allSchemas.push(schema);
            var queryType_1 = schema.getQueryType();
            var mutationType_1 = schema.getMutationType();
            var subscriptionType_1 = schema.getSubscriptionType();
            if (queryType_1) {
                addTypeCandidate(typeCandidates, 'Query', {
                    schema: schema,
                    type: queryType_1,
                });
            }
            if (mutationType_1) {
                addTypeCandidate(typeCandidates, 'Mutation', {
                    schema: schema,
                    type: mutationType_1,
                });
            }
            if (subscriptionType_1) {
                addTypeCandidate(typeCandidates, 'Subscription', {
                    schema: schema,
                    type: subscriptionType_1,
                });
            }
            var typeMap_1 = schema.getTypeMap();
            Object.keys(typeMap_1).forEach(function (typeName) {
                var type = typeMap_1[typeName];
                if (graphql_1.isNamedType(type) &&
                    graphql_1.getNamedType(type).name.slice(0, 2) !== '__' &&
                    type !== queryType_1 &&
                    type !== mutationType_1 &&
                    type !== subscriptionType_1) {
                    addTypeCandidate(typeCandidates, type.name, {
                        schema: schema,
                        type: type,
                    });
                }
            });
        }
        else if (typeof schema === 'string') {
            var parsedSchemaDocument = graphql_1.parse(schema);
            parsedSchemaDocument.definitions.forEach(function (def) {
                var type = typeFromAST_1.default(def, createNamedStub);
                if (type) {
                    addTypeCandidate(typeCandidates, type.name, {
                        type: type,
                    });
                }
            });
            var extensionsDocument = schemaGenerator_1.extractExtensionDefinitions(parsedSchemaDocument);
            if (extensionsDocument.definitions.length > 0) {
                extensions.push(extensionsDocument);
            }
        }
        else if (Array.isArray(schema)) {
            schema.forEach(function (type) {
                addTypeCandidate(typeCandidates, type.name, {
                    type: type,
                });
            });
        }
        else {
            throw new Error("Invalid schema passed");
        }
    });
    var mergeInfo = createMergeInfo(allSchemas, fragments);
    if (!resolvers) {
        resolvers = {};
    }
    else if (typeof resolvers === 'function') {
        console.warn('Passing functions as resolver parameter is deprecated. Use `info.mergeInfo` instead.');
        resolvers = resolvers(mergeInfo);
    }
    else if (Array.isArray(resolvers)) {
        resolvers = resolvers.reduce(function (left, right) {
            if (typeof right === 'function') {
                console.warn('Passing functions as resolver parameter is deprecated. Use `info.mergeInfo` instead.');
                right = right(mergeInfo);
            }
            return mergeDeep_1.default(left, right);
        }, {});
    }
    var generatedResolvers = {};
    Object.keys(typeCandidates).forEach(function (typeName) {
        var resultType = visitType(typeName, typeCandidates[typeName]);
        if (resultType === null) {
            types[typeName] = null;
        }
        else {
            var type = void 0;
            var typeResolvers = void 0;
            if (graphql_1.isNamedType(resultType)) {
                type = resultType;
            }
            else if (resultType.type) {
                type = resultType.type;
                typeResolvers = resultType.resolvers;
            }
            else {
                throw new Error('Invalid `visitType` result for type "${typeName}"');
            }
            types[typeName] = schemaRecreation_1.recreateType(type, resolveType, false);
            if (typeResolvers) {
                generatedResolvers[typeName] = typeResolvers;
            }
        }
    });
    var mergedSchema = new graphql_1.GraphQLSchema({
        query: types.Query,
        mutation: types.Mutation,
        subscription: types.Subscription,
        types: Object.keys(types).map(function (key) { return types[key]; }),
    });
    extensions.forEach(function (extension) {
        mergedSchema = graphql_1.extendSchema(mergedSchema, extension, {
            commentDescriptions: true,
        });
    });
    if (!resolvers) {
        resolvers = {};
    }
    else if (Array.isArray(resolvers)) {
        resolvers = resolvers.reduce(mergeDeep_1.default, {});
    }
    Object.keys(resolvers).forEach(function (typeName) {
        var type = resolvers[typeName];
        if (type instanceof graphql_1.GraphQLScalarType) {
            return;
        }
        Object.keys(type).forEach(function (fieldName) {
            var field = type[fieldName];
            if (field.fragment) {
                fragments.push({
                    field: fieldName,
                    fragment: field.fragment,
                });
            }
        });
    });
    schemaGenerator_1.addResolveFunctionsToSchema({
        schema: mergedSchema,
        resolvers: mergeDeep_1.default(generatedResolvers, resolvers),
    });
    forEachField(mergedSchema, function (field) {
        if (field.resolve) {
            var fieldResolver_1 = field.resolve;
            field.resolve = function (parent, args, context, info) {
                var newInfo = __assign({}, info, { mergeInfo: mergeInfo });
                return fieldResolver_1(parent, args, context, newInfo);
            };
        }
        if (field.subscribe) {
            var fieldResolver_2 = field.subscribe;
            field.subscribe = function (parent, args, context, info) {
                var newInfo = __assign({}, info, { mergeInfo: mergeInfo });
                return fieldResolver_2(parent, args, context, newInfo);
            };
        }
    });
    return mergedSchema;
}
function createMergeInfo(allSchemas, fragments) {
    return {
        delegate: function (operation, fieldName, args, context, info, transforms) {
            console.warn('`mergeInfo.delegate` is deprecated. ' +
                'Use `mergeInfo.delegateToSchema and pass explicit schema instances.');
            var schema = guessSchemaByRootField(allSchemas, operation, fieldName);
            var expandTransforms = new transforms_1.ExpandAbstractTypes(info.schema, schema);
            var fragmentTransform = new transforms_1.ReplaceFieldWithFragment(schema, fragments);
            return delegateToSchema_1.default({
                schema: schema,
                operation: operation,
                fieldName: fieldName,
                args: args,
                context: context,
                info: info,
                transforms: (transforms || []).concat([
                    expandTransforms,
                    fragmentTransform,
                ]),
            });
        },
        delegateToSchema: function (options) {
            return delegateToSchema_1.default(__assign({}, options, { transforms: (options.transforms || []).concat([
                    new transforms_1.ExpandAbstractTypes(options.info.schema, options.schema),
                    new transforms_1.ReplaceFieldWithFragment(options.schema, fragments),
                ]) }));
        },
    };
}
function guessSchemaByRootField(schemas, operation, fieldName) {
    for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
        var schema = schemas_1[_i];
        var rootObject = void 0;
        if (operation === 'subscription') {
            rootObject = schema.getSubscriptionType();
        }
        else if (operation === 'mutation') {
            rootObject = schema.getMutationType();
        }
        else {
            rootObject = schema.getQueryType();
        }
        if (rootObject) {
            var fields = rootObject.getFields();
            if (fields[fieldName]) {
                return schema;
            }
        }
    }
    throw new Error("Could not find subschema with field `{operation}.{fieldName}`");
}
function createDelegatingResolver(schema, operation, fieldName) {
    return function (root, args, context, info) {
        return info.mergeInfo.delegateToSchema({
            schema: schema,
            operation: operation,
            fieldName: fieldName,
            args: args,
            context: context,
            info: info,
        });
    };
}
function forEachField(schema, fn) {
    var typeMap = schema.getTypeMap();
    Object.keys(typeMap).forEach(function (typeName) {
        var type = typeMap[typeName];
        if (!graphql_1.getNamedType(type).name.startsWith('__') &&
            type instanceof graphql_1.GraphQLObjectType) {
            var fields_1 = type.getFields();
            Object.keys(fields_1).forEach(function (fieldName) {
                var field = fields_1[fieldName];
                fn(field, typeName, fieldName);
            });
        }
    });
}
function addTypeCandidate(typeCandidates, name, typeCandidate) {
    if (!typeCandidates[name]) {
        typeCandidates[name] = [];
    }
    typeCandidates[name].push(typeCandidate);
}
function createVisitTypeFromOnTypeConflict(onTypeConflict) {
    return function (name, candidates) {
        return defaultVisitType(name, candidates, function (cands) {
            return cands.reduce(function (prev, next) {
                var type = onTypeConflict(prev.type, next.type, {
                    left: {
                        schema: prev.schema,
                    },
                    right: {
                        schema: prev.schema,
                    },
                });
                if (prev.type === type) {
                    return prev;
                }
                else if (next.type === type) {
                    return next;
                }
                else {
                    return {
                        schemaName: 'unknown',
                        type: type,
                    };
                }
            });
        });
    };
}
var defaultVisitType = function (name, candidates, candidateSelector) {
    if (!candidateSelector) {
        candidateSelector = function (cands) { return cands[cands.length - 1]; };
    }
    var resolveType = schemaRecreation_1.createResolveType(function (_, type) { return type; });
    if (name === 'Query' || name === 'Mutation' || name === 'Subscription') {
        var fields_2 = {};
        var operationName_1;
        switch (name) {
            case 'Query':
                operationName_1 = 'query';
                break;
            case 'Mutation':
                operationName_1 = 'mutation';
                break;
            case 'Subscription':
                operationName_1 = 'subscription';
                break;
            default:
                break;
        }
        var resolvers_1 = {};
        var resolverKey_1 = operationName_1 === 'subscription' ? 'subscribe' : 'resolve';
        candidates.forEach(function (_a) {
            var candidateType = _a.type, schema = _a.schema;
            var candidateFields = candidateType.getFields();
            fields_2 = __assign({}, fields_2, candidateFields);
            Object.keys(candidateFields).forEach(function (fieldName) {
                resolvers_1[fieldName] = (_a = {},
                    _a[resolverKey_1] = createDelegatingResolver(schema, operationName_1, fieldName),
                    _a);
                var _a;
            });
        });
        var type = new graphql_1.GraphQLObjectType({
            name: name,
            fields: schemaRecreation_1.fieldMapToFieldConfigMap(fields_2, resolveType, false),
        });
        return {
            type: type,
            resolvers: resolvers_1,
        };
    }
    else {
        var candidate = candidateSelector(candidates);
        return candidate.type;
    }
};
//# sourceMappingURL=mergeSchemas.js.map