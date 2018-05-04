"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var schemaGenerator_1 = require("../schemaGenerator");
var schemaVisitor_1 = require("../schemaVisitor");
var graphql_1 = require("graphql");
var formatDate = require("dateformat");
var typeDefs = "\ndirective @schemaDirective(role: String) on SCHEMA\ndirective @enumValueDirective on ENUM_VALUE\n\nschema @schemaDirective(role: \"admin\") {\n  query: Query\n  mutation: Mutation\n}\n\ntype Query @queryTypeDirective {\n  people: [Person] @queryFieldDirective\n}\n\nenum Gender @enumTypeDirective {\n  NONBINARY @enumValueDirective\n  FEMALE\n  MALE\n}\n\nscalar Date @dateDirective(tz: \"utc\")\n\ninterface Named @interfaceDirective {\n  name: String! @interfaceFieldDirective\n}\n\ninput PersonInput @inputTypeDirective {\n  name: String! @inputFieldDirective\n  gender: Gender\n}\n\ntype Mutation @mutationTypeDirective {\n  addPerson(\n    input: PersonInput @mutationArgumentDirective\n  ): Person @mutationMethodDirective\n}\n\ntype Person implements Named @objectTypeDirective {\n  id: ID! @objectFieldDirective\n  name: String!\n}\n\nunion WhateverUnion @unionDirective = Person | Query | Mutation\n";
describe('@directives', function () {
    it('are included in the schema AST', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefs,
        });
        function checkDirectives(type, typeDirectiveNames, fieldDirectiveMap) {
            if (fieldDirectiveMap === void 0) { fieldDirectiveMap = {}; }
            chai_1.assert.deepEqual(getDirectiveNames(type), typeDirectiveNames);
            Object.keys(fieldDirectiveMap).forEach(function (key) {
                chai_1.assert.deepEqual(getDirectiveNames(type.getFields()[key]), fieldDirectiveMap[key]);
            });
        }
        function getDirectiveNames(type) {
            return type.astNode.directives.map(function (d) { return d.name.value; });
        }
        chai_1.assert.deepEqual(getDirectiveNames(schema), ['schemaDirective']);
        checkDirectives(schema.getQueryType(), ['queryTypeDirective'], {
            people: ['queryFieldDirective'],
        });
        chai_1.assert.deepEqual(getDirectiveNames(schema.getType('Gender')), ['enumTypeDirective']);
        var nonBinary = schema.getType('Gender').getValues()[0];
        chai_1.assert.deepEqual(getDirectiveNames(nonBinary), ['enumValueDirective']);
        checkDirectives(schema.getType('Date'), ['dateDirective']);
        checkDirectives(schema.getType('Named'), ['interfaceDirective'], {
            name: ['interfaceFieldDirective'],
        });
        checkDirectives(schema.getType('PersonInput'), ['inputTypeDirective'], {
            name: ['inputFieldDirective'],
            gender: [],
        });
        checkDirectives(schema.getMutationType(), ['mutationTypeDirective'], {
            addPerson: ['mutationMethodDirective'],
        });
        chai_1.assert.deepEqual(getDirectiveNames(schema.getMutationType().getFields().addPerson.args[0]), ['mutationArgumentDirective']);
        checkDirectives(schema.getType('Person'), ['objectTypeDirective'], {
            id: ['objectFieldDirective'],
            name: [],
        });
        checkDirectives(schema.getType('WhateverUnion'), ['unionDirective']);
    });
    it('can be implemented with SchemaDirectiveVisitor', function () {
        var visited = new Set;
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: typeDefs });
        var visitCount = 0;
        schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
            // The directive subclass can be defined anonymously inline!
            queryTypeDirective: (_a = /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_1.prototype.visitObject = function (object) {
                        visited.add(object);
                        visitCount++;
                    };
                    return class_1;
                }(schemaVisitor_1.SchemaDirectiveVisitor)),
                _a.description = 'A @directive for query object types',
                _a),
        });
        chai_1.assert.strictEqual(visited.size, 1);
        chai_1.assert.strictEqual(visitCount, 1);
        visited.forEach(function (object) {
            chai_1.assert.strictEqual(object, schema.getType('Query'));
        });
        var _a;
    });
    it('can visit the schema itself', function () {
        var visited = [];
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: typeDefs });
        schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
            schemaDirective: /** @class */ (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.visitSchema = function (s) {
                    visited.push(s);
                };
                return class_2;
            }(schemaVisitor_1.SchemaDirectiveVisitor))
        });
        chai_1.assert.strictEqual(visited.length, 1);
        chai_1.assert.strictEqual(visited[0], schema);
    });
    it('can visit fields within object types', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: typeDefs });
        var mutationObjectType;
        var mutationField;
        var enumObjectType;
        var inputObjectType;
        schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
            mutationTypeDirective: /** @class */ (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_3.prototype.visitObject = function (object) {
                    mutationObjectType = object;
                    chai_1.assert.strictEqual(this.visitedType, object);
                    chai_1.assert.strictEqual(object.name, 'Mutation');
                };
                return class_3;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            mutationMethodDirective: /** @class */ (function (_super) {
                __extends(class_4, _super);
                function class_4() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_4.prototype.visitFieldDefinition = function (field, details) {
                    chai_1.assert.strictEqual(this.visitedType, field);
                    chai_1.assert.strictEqual(field.name, 'addPerson');
                    chai_1.assert.strictEqual(details.objectType, mutationObjectType);
                    chai_1.assert.strictEqual(field.args.length, 1);
                    mutationField = field;
                };
                return class_4;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            mutationArgumentDirective: /** @class */ (function (_super) {
                __extends(class_5, _super);
                function class_5() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_5.prototype.visitArgumentDefinition = function (arg, details) {
                    chai_1.assert.strictEqual(this.visitedType, arg);
                    chai_1.assert.strictEqual(arg.name, 'input');
                    chai_1.assert.strictEqual(details.field, mutationField);
                    chai_1.assert.strictEqual(details.objectType, mutationObjectType);
                    chai_1.assert.strictEqual(details.field.args[0], arg);
                };
                return class_5;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            enumTypeDirective: /** @class */ (function (_super) {
                __extends(class_6, _super);
                function class_6() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_6.prototype.visitEnum = function (enumType) {
                    chai_1.assert.strictEqual(this.visitedType, enumType);
                    chai_1.assert.strictEqual(enumType.name, 'Gender');
                    enumObjectType = enumType;
                };
                return class_6;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            enumValueDirective: /** @class */ (function (_super) {
                __extends(class_7, _super);
                function class_7() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_7.prototype.visitEnumValue = function (value, details) {
                    chai_1.assert.strictEqual(this.visitedType, value);
                    chai_1.assert.strictEqual(value.name, 'NONBINARY');
                    chai_1.assert.strictEqual(value.value, 'NONBINARY');
                    chai_1.assert.strictEqual(details.enumType, enumObjectType);
                };
                return class_7;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            inputTypeDirective: /** @class */ (function (_super) {
                __extends(class_8, _super);
                function class_8() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_8.prototype.visitInputObject = function (object) {
                    inputObjectType = object;
                    chai_1.assert.strictEqual(this.visitedType, object);
                    chai_1.assert.strictEqual(object.name, 'PersonInput');
                };
                return class_8;
            }(schemaVisitor_1.SchemaDirectiveVisitor)),
            inputFieldDirective: /** @class */ (function (_super) {
                __extends(class_9, _super);
                function class_9() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_9.prototype.visitInputFieldDefinition = function (field, details) {
                    chai_1.assert.strictEqual(this.visitedType, field);
                    chai_1.assert.strictEqual(field.name, 'name');
                    chai_1.assert.strictEqual(details.objectType, inputObjectType);
                };
                return class_9;
            }(schemaVisitor_1.SchemaDirectiveVisitor))
        });
    });
    it('can check if a visitor method is implemented', function () {
        var Visitor = /** @class */ (function (_super) {
            __extends(Visitor, _super);
            function Visitor() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Visitor.prototype.notVisitorMethod = function () {
                return; // Just to keep the tslint:no-empty rule satisfied.
            };
            Visitor.prototype.visitObject = function (object) {
                return object;
            };
            return Visitor;
        }(schemaVisitor_1.SchemaVisitor));
        chai_1.assert.strictEqual(Visitor.implementsVisitorMethod('notVisitorMethod'), false);
        chai_1.assert.strictEqual(Visitor.implementsVisitorMethod('visitObject'), true);
        chai_1.assert.strictEqual(Visitor.implementsVisitorMethod('visitInputFieldDefinition'), false);
        chai_1.assert.strictEqual(Visitor.implementsVisitorMethod('visitBogusType'), false);
    });
    it('can use visitSchema for simple visitor patterns', function () {
        var SimpleVisitor = /** @class */ (function (_super) {
            __extends(SimpleVisitor, _super);
            function SimpleVisitor(s) {
                var _this = _super.call(this) || this;
                _this.visitCount = 0;
                _this.names = [];
                _this.schema = s;
                return _this;
            }
            SimpleVisitor.prototype.visit = function () {
                var _this = this;
                // More complicated visitor implementations might use the
                // visitorSelector function more selectively, but this SimpleVisitor
                // class always volunteers itself to visit any schema type.
                schemaVisitor_1.visitSchema(this.schema, function () { return [_this]; });
            };
            SimpleVisitor.prototype.visitObject = function (object) {
                chai_1.assert.strictEqual(this.schema.getType(object.name), object);
                this.names.push(object.name);
            };
            return SimpleVisitor;
        }(schemaVisitor_1.SchemaVisitor));
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: typeDefs });
        var visitor = new SimpleVisitor(schema);
        visitor.visit();
        chai_1.assert.deepEqual(visitor.names.sort(), [
            'Mutation',
            'Person',
            'Query',
        ]);
    });
    it('can use SchemaDirectiveVisitor as a no-op visitor', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: typeDefs });
        var methodNamesEncountered = Object.create(null);
        var EnthusiasticVisitor = /** @class */ (function (_super) {
            __extends(EnthusiasticVisitor, _super);
            function EnthusiasticVisitor() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EnthusiasticVisitor.implementsVisitorMethod = function (name) {
                // Pretend this class implements all visitor methods. This is safe
                // because the SchemaVisitor base class provides empty stubs for all
                // the visitor methods that might be called.
                return methodNamesEncountered[name] = true;
            };
            return EnthusiasticVisitor;
        }(schemaVisitor_1.SchemaDirectiveVisitor));
        EnthusiasticVisitor.visitSchemaDirectives(schema, {
            schemaDirective: EnthusiasticVisitor,
            queryTypeDirective: EnthusiasticVisitor,
            queryFieldDirective: EnthusiasticVisitor,
            enumTypeDirective: EnthusiasticVisitor,
            enumValueDirective: EnthusiasticVisitor,
            dateDirective: EnthusiasticVisitor,
            interfaceDirective: EnthusiasticVisitor,
            interfaceFieldDirective: EnthusiasticVisitor,
            inputTypeDirective: EnthusiasticVisitor,
            inputFieldDirective: EnthusiasticVisitor,
            mutationTypeDirective: EnthusiasticVisitor,
            mutationArgumentDirective: EnthusiasticVisitor,
            mutationMethodDirective: EnthusiasticVisitor,
            objectTypeDirective: EnthusiasticVisitor,
            objectFieldDirective: EnthusiasticVisitor,
            unionDirective: EnthusiasticVisitor,
        });
        chai_1.assert.deepEqual(Object.keys(methodNamesEncountered).sort(), Object.keys(schemaVisitor_1.SchemaVisitor.prototype)
            .filter(function (name) { return name.startsWith('visit'); })
            .sort());
    });
    it('can handle all kinds of undeclared arguments', function () {
        var schemaText = "\n    enum SpineEnum {\n      VERTEBRATE @directive(spineless: false)\n      INVERTEBRATE @directive(spineless: true)\n    }\n\n    type Query @directive(c: null, d: 1, e: { oyez: 3.1415926 }) {\n      animal(\n        name: String @directive(f: [\"n\", \"a\", \"m\", \"e\"])\n      ): Animal @directive(g: INVERTEBRATE)\n    }\n\n    type Animal {\n      name: String @directive(default: \"horse\")\n      spine: SpineEnum @directive(default: VERTEBRATE)\n    }\n    ";
        var enumValueCount = 0;
        var objectCount = 0;
        var argumentCount = 0;
        var fieldCount = 0;
        var schemaDirectives = {
            directive: /** @class */ (function (_super) {
                __extends(class_10, _super);
                function class_10() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_10.prototype.visitEnumValue = function (value) {
                    ++enumValueCount;
                    chai_1.assert.strictEqual(this.args.spineless, value.name === 'INVERTEBRATE');
                };
                class_10.prototype.visitObject = function (object) {
                    ++objectCount;
                    chai_1.assert.strictEqual(this.args.c, null);
                    chai_1.assert.strictEqual(this.args.d, 1);
                    chai_1.assert.strictEqual(Math.round(this.args.e.oyez), 3);
                };
                class_10.prototype.visitArgumentDefinition = function (arg) {
                    ++argumentCount;
                    chai_1.assert.strictEqual(this.args.f.join(''), 'name');
                };
                class_10.prototype.visitFieldDefinition = function (field, details) {
                    ++fieldCount;
                    switch (details.objectType.name) {
                        case 'Query':
                            chai_1.assert.strictEqual(this.args.g, 'INVERTEBRATE');
                            break;
                        case 'Animal':
                            if (field.name === 'name') {
                                chai_1.assert.strictEqual(this.args.default, 'horse');
                            }
                            else if (field.name === 'spine') {
                                chai_1.assert.strictEqual(this.args.default, 'VERTEBRATE');
                            }
                            break;
                        default:
                            throw new Error('unexpected field parent object type');
                    }
                };
                return class_10;
            }(schemaVisitor_1.SchemaDirectiveVisitor))
        };
        schemaGenerator_1.makeExecutableSchema({
            typeDefs: schemaText,
            schemaDirectives: schemaDirectives,
        });
        chai_1.assert.strictEqual(enumValueCount, 2);
        chai_1.assert.strictEqual(objectCount, 1);
        chai_1.assert.strictEqual(argumentCount, 1);
        chai_1.assert.strictEqual(fieldCount, 3);
    });
    it('can also handle declared arguments', function () {
        var schemaText = "\n    directive @oyez(\n      times: Int = 5,\n      party: Party = IMPARTIAL,\n    ) on OBJECT | FIELD_DEFINITION\n\n    schema {\n      query: Courtroom\n    }\n\n    type Courtroom @oyez {\n      judge: String @oyez(times: 0)\n      marshall: String @oyez\n    }\n\n    enum Party {\n      DEFENSE\n      PROSECUTION\n      IMPARTIAL\n    }";
        var schema = schemaGenerator_1.makeExecutableSchema({ typeDefs: schemaText });
        var context = {
            objectCount: 0,
            fieldCount: 0,
        };
        var visitors = schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
            oyez: /** @class */ (function (_super) {
                __extends(class_11, _super);
                function class_11() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_11.getDirectiveDeclaration = function (name, theSchema) {
                    chai_1.assert.strictEqual(theSchema, schema);
                    var prev = schema.getDirective(name);
                    prev.args.some(function (arg) {
                        if (arg.name === 'times') {
                            // Override the default value of the times argument to be 3
                            // instead of 5.
                            arg.defaultValue = 3;
                            return true;
                        }
                    });
                    return prev;
                };
                class_11.prototype.visitObject = function (object) {
                    ++this.context.objectCount;
                    chai_1.assert.strictEqual(this.args.times, 3);
                };
                class_11.prototype.visitFieldDefinition = function (field) {
                    ++this.context.fieldCount;
                    if (field.name === 'judge') {
                        chai_1.assert.strictEqual(this.args.times, 0);
                    }
                    else if (field.name === 'marshall') {
                        chai_1.assert.strictEqual(this.args.times, 3);
                    }
                    chai_1.assert.strictEqual(this.args.party, 'IMPARTIAL');
                };
                return class_11;
            }(schemaVisitor_1.SchemaDirectiveVisitor))
        }, context);
        chai_1.assert.strictEqual(context.objectCount, 1);
        chai_1.assert.strictEqual(context.fieldCount, 2);
        chai_1.assert.deepEqual(Object.keys(visitors), ['oyez']);
        chai_1.assert.deepEqual(visitors.oyez.map(function (v) {
            return v.visitedType.name;
        }), ['Courtroom', 'judge', 'marshall']);
    });
    it('can be used to implement the @upper example', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      directive @upper on FIELD_DEFINITION\n\n      type Query {\n        hello: String @upper\n      }",
            schemaDirectives: {
                upper: /** @class */ (function (_super) {
                    __extends(class_12, _super);
                    function class_12() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_12.prototype.visitFieldDefinition = function (field) {
                        var _a = field.resolve, resolve = _a === void 0 ? graphql_1.defaultFieldResolver : _a;
                        field.resolve = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, resolve.apply(this, args)];
                                        case 1:
                                            result = _a.sent();
                                            if (typeof result === 'string') {
                                                return [2 /*return*/, result.toUpperCase()];
                                            }
                                            return [2 /*return*/, result];
                                    }
                                });
                            });
                        };
                    };
                    return class_12;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            },
            resolvers: {
                Query: {
                    hello: function () {
                        return 'hello world';
                    }
                }
            }
        });
        return graphql_1.graphql(schema, "\n    query {\n      hello\n    }\n    ").then(function (_a) {
            var data = _a.data;
            chai_1.assert.deepEqual(data, {
                hello: 'HELLO WORLD'
            });
        });
    });
    it('can be used to implement the @date example', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      directive @date(format: String) on FIELD_DEFINITION\n\n      scalar Date\n\n      type Query {\n        today: Date @date(format: \"mmmm d, yyyy\")\n      }",
            schemaDirectives: {
                date: /** @class */ (function (_super) {
                    __extends(class_13, _super);
                    function class_13() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_13.prototype.visitFieldDefinition = function (field) {
                        var _a = field.resolve, resolve = _a === void 0 ? graphql_1.defaultFieldResolver : _a;
                        var format = this.args.format;
                        field.type = graphql_1.GraphQLString;
                        field.resolve = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(this, void 0, void 0, function () {
                                var date;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, resolve.apply(this, args)];
                                        case 1:
                                            date = _a.sent();
                                            return [2 /*return*/, formatDate(date, format, true)];
                                    }
                                });
                            });
                        };
                    };
                    return class_13;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            },
            resolvers: {
                Query: {
                    today: function () {
                        return new Date(1519688273858).toUTCString();
                    }
                }
            }
        });
        return graphql_1.graphql(schema, "\n    query {\n      today\n    }\n    ").then(function (_a) {
            var data = _a.data;
            chai_1.assert.deepEqual(data, {
                today: 'February 26, 2018'
            });
        });
    });
    it('can be used to implement the @date by adding an argument', function () { return __awaiter(_this, void 0, void 0, function () {
        var FormattableDateDirective, schema, resultNoArg, resultWithArg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    FormattableDateDirective = /** @class */ (function (_super) {
                        __extends(FormattableDateDirective, _super);
                        function FormattableDateDirective() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        FormattableDateDirective.prototype.visitFieldDefinition = function (field) {
                            var _a = field.resolve, resolve = _a === void 0 ? graphql_1.defaultFieldResolver : _a;
                            var defaultFormat = this.args.defaultFormat;
                            field.args.push({
                                name: 'format',
                                type: graphql_1.GraphQLString
                            });
                            field.type = graphql_1.GraphQLString;
                            field.resolve = function (source, _a, context, info) {
                                var format = _a.format, args = __rest(_a, ["format"]);
                                return __awaiter(this, void 0, void 0, function () {
                                    var date;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                format = format || defaultFormat;
                                                return [4 /*yield*/, resolve.call(this, source, args, context, info)];
                                            case 1:
                                                date = _b.sent();
                                                return [2 /*return*/, formatDate(date, format, true)];
                                        }
                                    });
                                });
                            };
                        };
                        return FormattableDateDirective;
                    }(schemaVisitor_1.SchemaDirectiveVisitor));
                    schema = schemaGenerator_1.makeExecutableSchema({
                        typeDefs: "\n      directive @date(\n        defaultFormat: String = \"mmmm d, yyyy\"\n      ) on FIELD_DEFINITION\n\n      scalar Date\n\n      type Query {\n        today: Date @date\n      }",
                        schemaDirectives: {
                            date: FormattableDateDirective
                        },
                        resolvers: {
                            Query: {
                                today: function () {
                                    return new Date(1521131357195);
                                }
                            }
                        }
                    });
                    return [4 /*yield*/, graphql_1.graphql(schema, "query { today }")];
                case 1:
                    resultNoArg = _a.sent();
                    if (resultNoArg.errors) {
                        chai_1.assert.deepEqual(resultNoArg.errors, []);
                    }
                    chai_1.assert.deepEqual(resultNoArg.data, { today: 'March 15, 2018' });
                    return [4 /*yield*/, graphql_1.graphql(schema, "\n    query {\n      today(format: \"dd mmm yyyy\")\n    }")];
                case 2:
                    resultWithArg = _a.sent();
                    if (resultWithArg.errors) {
                        chai_1.assert.deepEqual(resultWithArg.errors, []);
                    }
                    chai_1.assert.deepEqual(resultWithArg.data, { today: '15 Mar 2018' });
                    return [2 /*return*/];
            }
        });
    }); });
    it('can be used to implement the @intl example', function () {
        function translate(text, path, locale) {
            chai_1.assert.strictEqual(text, 'hello');
            chai_1.assert.deepEqual(path, ['Query', 'greeting']);
            chai_1.assert.strictEqual(locale, 'fr');
            return 'bonjour';
        }
        var context = {
            locale: 'fr'
        };
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      directive @intl on FIELD_DEFINITION\n\n      type Query {\n        greeting: String @intl\n      }",
            schemaDirectives: {
                intl: /** @class */ (function (_super) {
                    __extends(class_14, _super);
                    function class_14() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_14.prototype.visitFieldDefinition = function (field, details) {
                        var _a = field.resolve, resolve = _a === void 0 ? graphql_1.defaultFieldResolver : _a;
                        field.resolve = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(this, void 0, void 0, function () {
                                var defaultText, path;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, resolve.apply(this, args)];
                                        case 1:
                                            defaultText = _a.sent();
                                            path = [details.objectType.name, field.name];
                                            chai_1.assert.strictEqual(args[2], context);
                                            return [2 /*return*/, translate(defaultText, path, context.locale)];
                                    }
                                });
                            });
                        };
                    };
                    return class_14;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            },
            resolvers: {
                Query: {
                    greeting: function () {
                        return 'hello';
                    }
                }
            }
        });
        return graphql_1.graphql(schema, "\n    query {\n      greeting\n    }\n    ", null, context).then(function (_a) {
            var data = _a.data;
            chai_1.assert.deepEqual(data, {
                greeting: 'bonjour'
            });
        });
    });
    it('can be used to implement the @auth example', function () { return __awaiter(_this, void 0, void 0, function () {
        function getUser(token) {
            return {
                hasRole: function (role) {
                    var tokenIndex = roles.indexOf(token);
                    var roleIndex = roles.indexOf(role);
                    return roleIndex >= 0 && tokenIndex >= roleIndex;
                }
            };
        }
        function execWithRole(role) {
            return graphql_1.graphql(schema, "\n      query {\n        users {\n          name\n          banned\n          canPost\n        }\n      }\n      ", null, {
                headers: {
                    authToken: role,
                }
            });
        }
        function checkErrors(expectedCount) {
            var expectedNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                expectedNames[_i - 1] = arguments[_i];
            }
            return function (_a) {
                var _b = _a.errors, errors = _b === void 0 ? [] : _b, data = _a.data;
                chai_1.assert.strictEqual(errors.length, expectedCount);
                chai_1.assert(errors.every(function (error) { return error.message === 'not authorized'; }));
                var actualNames = errors.map(function (error) { return error.path.slice(-1)[0]; });
                chai_1.assert.deepEqual(expectedNames.sort(), actualNames.sort());
                return data;
            };
        }
        var roles, AuthDirective, schema;
        return __generator(this, function (_a) {
            roles = [
                'UNKNOWN',
                'USER',
                'REVIEWER',
                'ADMIN',
            ];
            AuthDirective = /** @class */ (function (_super) {
                __extends(AuthDirective, _super);
                function AuthDirective() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AuthDirective.prototype.visitObject = function (type) {
                    this.ensureFieldsWrapped(type);
                    type._requiredAuthRole = this.args.requires;
                };
                // Visitor methods for nested types like fields and arguments
                // also receive a details object that provides information about
                // the parent and grandparent types.
                AuthDirective.prototype.visitFieldDefinition = function (field, details) {
                    this.ensureFieldsWrapped(details.objectType);
                    field._requiredAuthRole = this.args.requires;
                };
                AuthDirective.prototype.ensureFieldsWrapped = function (objectType) {
                    // Mark the GraphQLObjectType object to avoid re-wrapping:
                    if (objectType._authFieldsWrapped) {
                        return;
                    }
                    objectType._authFieldsWrapped = true;
                    var fields = objectType.getFields();
                    Object.keys(fields).forEach(function (fieldName) {
                        var field = fields[fieldName];
                        var _a = field.resolve, resolve = _a === void 0 ? graphql_1.defaultFieldResolver : _a;
                        field.resolve = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(this, void 0, void 0, function () {
                                var requiredRole, context, user;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            requiredRole = field._requiredAuthRole ||
                                                objectType._requiredAuthRole;
                                            if (!requiredRole) {
                                                return [2 /*return*/, resolve.apply(this, args)];
                                            }
                                            context = args[2];
                                            return [4 /*yield*/, getUser(context.headers.authToken)];
                                        case 1:
                                            user = _a.sent();
                                            if (!user.hasRole(requiredRole)) {
                                                throw new Error('not authorized');
                                            }
                                            return [2 /*return*/, resolve.apply(this, args)];
                                    }
                                });
                            });
                        };
                    });
                };
                return AuthDirective;
            }(schemaVisitor_1.SchemaDirectiveVisitor));
            schema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: "\n      directive @auth(\n        requires: Role = ADMIN,\n      ) on OBJECT | FIELD_DEFINITION\n\n      enum Role {\n        ADMIN\n        REVIEWER\n        USER\n        UNKNOWN\n      }\n\n      type User @auth(requires: USER) {\n        name: String\n        banned: Boolean @auth(requires: ADMIN)\n        canPost: Boolean @auth(requires: REVIEWER)\n      }\n\n      type Query {\n        users: [User]\n      }",
                schemaDirectives: {
                    auth: AuthDirective
                },
                resolvers: {
                    Query: {
                        users: function () {
                            return [{
                                    banned: true,
                                    canPost: false,
                                    name: 'Ben'
                                }];
                        }
                    }
                }
            });
            return [2 /*return*/, Promise.all([
                    execWithRole('UNKNOWN').then(checkErrors(3, 'banned', 'canPost', 'name')),
                    execWithRole('USER').then(checkErrors(2, 'banned', 'canPost')),
                    execWithRole('REVIEWER').then(checkErrors(1, 'banned')),
                    execWithRole('ADMIN').then(checkErrors(0)).then(function (data) {
                        chai_1.assert.strictEqual(data.users.length, 1);
                        chai_1.assert.strictEqual(data.users[0].banned, true);
                        chai_1.assert.strictEqual(data.users[0].canPost, false);
                        chai_1.assert.strictEqual(data.users[0].name, 'Ben');
                    }),
                ])];
        });
    }); });
    it('can be used to implement the @length example', function () { return __awaiter(_this, void 0, void 0, function () {
        var LimitedLengthType, schema, errors, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    LimitedLengthType = /** @class */ (function (_super) {
                        __extends(LimitedLengthType, _super);
                        function LimitedLengthType(type, maxLength) {
                            return _super.call(this, {
                                name: "LengthAtMost" + maxLength,
                                serialize: function (value) {
                                    value = type.serialize(value);
                                    chai_1.assert.strictEqual(typeof value.length, 'number');
                                    chai_1.assert.isAtMost(value.length, maxLength);
                                    return value;
                                },
                                parseValue: function (value) {
                                    return type.parseValue(value);
                                },
                                parseLiteral: function (ast) {
                                    return type.parseLiteral(ast);
                                }
                            }) || this;
                        }
                        return LimitedLengthType;
                    }(graphql_1.GraphQLScalarType));
                    schema = schemaGenerator_1.makeExecutableSchema({
                        typeDefs: "\n      directive @length(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION\n\n      type Query {\n        books: [Book]\n      }\n\n      type Book {\n        title: String @length(max: 10)\n      }\n\n      type Mutation {\n        createBook(book: BookInput): Book\n      }\n\n      input BookInput {\n        title: String! @length(max: 10)\n      }",
                        schemaDirectives: {
                            length: /** @class */ (function (_super) {
                                __extends(class_15, _super);
                                function class_15() {
                                    return _super !== null && _super.apply(this, arguments) || this;
                                }
                                class_15.prototype.visitInputFieldDefinition = function (field) {
                                    this.wrapType(field);
                                };
                                class_15.prototype.visitFieldDefinition = function (field) {
                                    this.wrapType(field);
                                };
                                class_15.prototype.wrapType = function (field) {
                                    if (field.type instanceof graphql_1.GraphQLNonNull &&
                                        field.type.ofType instanceof graphql_1.GraphQLScalarType) {
                                        field.type = new graphql_1.GraphQLNonNull(new LimitedLengthType(field.type.ofType, this.args.max));
                                    }
                                    else if (field.type instanceof graphql_1.GraphQLScalarType) {
                                        field.type = new LimitedLengthType(field.type, this.args.max);
                                    }
                                    else {
                                        throw new Error("Not a scalar type: " + field.type);
                                    }
                                };
                                return class_15;
                            }(schemaVisitor_1.SchemaDirectiveVisitor))
                        },
                        resolvers: {
                            Query: {
                                books: function () {
                                    return [{
                                            title: 'abcdefghijklmnopqrstuvwxyz'
                                        }];
                                }
                            },
                            Mutation: {
                                createBook: function (parent, args) {
                                    return args.book;
                                }
                            }
                        }
                    });
                    return [4 /*yield*/, graphql_1.graphql(schema, "\n    query {\n      books {\n        title\n      }\n    }\n    ")];
                case 1:
                    errors = (_a.sent()).errors;
                    chai_1.assert.strictEqual(errors.length, 1);
                    chai_1.assert.strictEqual(errors[0].message, 'expected 26 to be at most 10');
                    return [4 /*yield*/, graphql_1.graphql(schema, "\n    mutation {\n      createBook(book: { title: \"safe title\" }) {\n        title\n      }\n    }\n    ")];
                case 2:
                    result = _a.sent();
                    if (result.errors) {
                        chai_1.assert.deepEqual(result.errors, []);
                    }
                    chai_1.assert.deepEqual(result.data, {
                        createBook: {
                            title: 'safe title'
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('can be used to implement the @uniqueID example', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      type Query {\n        people: [Person]\n        locations: [Location]\n      }\n\n      type Person @uniqueID(name: \"uid\", from: [\"personID\"]) {\n        personID: Int\n        name: String\n      }\n\n      type Location @uniqueID(name: \"uid\", from: [\"locationID\"]) {\n        locationID: Int\n        address: String\n      }",
            schemaDirectives: {
                uniqueID: /** @class */ (function (_super) {
                    __extends(class_16, _super);
                    function class_16() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_16.prototype.visitObject = function (type) {
                        var _a = this.args, name = _a.name, from = _a.from;
                        type.getFields()[name] = {
                            name: name,
                            type: graphql_1.GraphQLID,
                            description: 'Unique ID',
                            args: [],
                            resolve: function (object) {
                                var hash = require('crypto').createHash('sha1');
                                hash.update(type.name);
                                from.forEach(function (fieldName) {
                                    hash.update(String(object[fieldName]));
                                });
                                return hash.digest('hex');
                            }
                        };
                    };
                    return class_16;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            },
            resolvers: {
                Query: {
                    people: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return [{
                                personID: 1,
                                name: 'Ben',
                            }];
                    },
                    locations: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return [{
                                locationID: 1,
                                address: '140 10th St',
                            }];
                    }
                }
            }
        });
        return graphql_1.graphql(schema, "\n    query {\n      people {\n        uid\n        personID\n        name\n      }\n      locations {\n        uid\n        locationID\n        address\n      }\n    }\n    ", null, context).then(function (result) {
            var data = result.data;
            chai_1.assert.deepEqual(data.people, [{
                    uid: '580a207c8e94f03b93a2b01217c3cc218490571a',
                    personID: 1,
                    name: 'Ben',
                }]);
            chai_1.assert.deepEqual(data.locations, [{
                    uid: 'c31b71e6e23a7ae527f94341da333590dd7cba96',
                    locationID: 1,
                    address: '140 10th St',
                }]);
        });
    });
    it('automatically updates references to changed types', function () {
        var HumanType = null;
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefs,
            schemaDirectives: {
                objectTypeDirective: /** @class */ (function (_super) {
                    __extends(class_17, _super);
                    function class_17() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_17.prototype.visitObject = function (object) {
                        return HumanType = Object.create(object, {
                            name: { value: 'Human' }
                        });
                    };
                    return class_17;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            }
        });
        var Query = schema.getType('Query');
        var peopleType = Query.getFields().people.type;
        if (peopleType instanceof graphql_1.GraphQLList) {
            chai_1.assert.strictEqual(peopleType.ofType, HumanType);
        }
        else {
            throw new Error('Query.people not a GraphQLList type');
        }
        var Mutation = schema.getType('Mutation');
        var addPersonResultType = Mutation.getFields().addPerson.type;
        chai_1.assert.strictEqual(addPersonResultType, HumanType);
        var WhateverUnion = schema.getType('WhateverUnion');
        var found = WhateverUnion.getTypes().some(function (type) {
            if (type.name === 'Human') {
                chai_1.assert.strictEqual(type, HumanType);
                return true;
            }
        });
        chai_1.assert.strictEqual(found, true);
        // Make sure that the Person type was actually removed.
        chai_1.assert.strictEqual(typeof schema.getType('Person'), 'undefined');
    });
    it('can remove enum values', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      type Query {\n        age(unit: AgeUnit): Int\n      }\n\n      enum AgeUnit {\n        DOG_YEARS\n        TURTLE_YEARS @remove(if: true)\n        PERSON_YEARS @remove(if: false)\n      }",
            schemaDirectives: {
                remove: /** @class */ (function (_super) {
                    __extends(class_18, _super);
                    function class_18() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_18.prototype.visitEnumValue = function (value) {
                        if (this.args.if) {
                            return null;
                        }
                    };
                    return class_18;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            }
        });
        var AgeUnit = schema.getType('AgeUnit');
        chai_1.assert.deepEqual(AgeUnit.getValues().map(function (value) { return value.name; }), ['DOG_YEARS', 'PERSON_YEARS']);
    });
    it('can swap names of GraphQLNamedType objects', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      type Query {\n        people: [Person]\n      }\n\n      type Person @rename(to: \"Human\") {\n        heightInInches: Int\n      }\n\n      scalar Date\n\n      type Human @rename(to: \"Person\") {\n        born: Date\n      }",
            schemaDirectives: {
                rename: /** @class */ (function (_super) {
                    __extends(class_19, _super);
                    function class_19() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_19.prototype.visitObject = function (object) {
                        object.name = this.args.to;
                    };
                    return class_19;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            }
        });
        var Human = schema.getType('Human');
        chai_1.assert.strictEqual(Human.name, 'Human');
        chai_1.assert.strictEqual(Human.getFields().heightInInches.type, graphql_1.GraphQLInt);
        var Person = schema.getType('Person');
        chai_1.assert.strictEqual(Person.name, 'Person');
        chai_1.assert.strictEqual(Person.getFields().born.type, schema.getType('Date'));
        var Query = schema.getType('Query');
        var peopleType = Query.getFields().people.type;
        chai_1.assert.strictEqual(peopleType.ofType, Human);
    });
    it('does not enforce query directive locations (issue #680)', function () {
        var visited = new Set();
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n      directive @hasScope(scope: [String]) on QUERY | FIELD\n\n      type Query @hasScope {\n        oyez: String\n      }",
            schemaDirectives: {
                hasScope: /** @class */ (function (_super) {
                    __extends(class_20, _super);
                    function class_20() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_20.prototype.visitObject = function (object) {
                        chai_1.assert.strictEqual(object.name, 'Query');
                        visited.add(object);
                    };
                    return class_20;
                }(schemaVisitor_1.SchemaDirectiveVisitor))
            }
        });
        chai_1.assert.strictEqual(visited.size, 1);
        visited.forEach(function (object) {
            chai_1.assert.strictEqual(schema.getType('Query'), object);
        });
    });
});
//# sourceMappingURL=testDirectives.js.map