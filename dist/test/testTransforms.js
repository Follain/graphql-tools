"use strict";
/* tslint:disable:no-unused-expression */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var graphql_1 = require("graphql");
var schemaGenerator_1 = require("../schemaGenerator");
var testingSchemas_1 = require("./testingSchemas");
var delegateToSchema_1 = require("../stitching/delegateToSchema");
var transforms_1 = require("../transforms");
describe('transforms', function () {
    describe('rename type', function () {
        var schema;
        before(function () {
            var transforms = [
                new transforms_1.RenameTypes(function (name) {
                    return ({
                        Property: 'House',
                        Location: 'Spots',
                        TestInterface: 'TestingInterface',
                        DateTime: 'Datum',
                        InputWithDefault: 'DefaultingInput',
                        TestInterfaceKind: 'TestingInterfaceKinds',
                        TestImpl1: 'TestImplementation1',
                    }[name]);
                }),
            ];
            schema = transforms_1.transformSchema(testingSchemas_1.propertySchema, transforms);
        });
        it('should work', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          query($input: DefaultingInput!) {\n            interfaceTest(kind: ONE) {\n              ... on TestingInterface {\n                testString\n              }\n            }\n            propertyById(id: \"p1\") {\n              ... on House {\n                id\n              }\n            }\n            dateTimeTest\n            defaultInputTest(input: $input)\n          }\n        ", {}, {}, {
                            input: {
                                test: 'bar',
                            },
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            data: {
                                dateTimeTest: '1987-09-25T12:00:00',
                                defaultInputTest: 'bar',
                                interfaceTest: {
                                    testString: 'test',
                                },
                                propertyById: {
                                    id: 'p1',
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('namespace', function () {
        var schema;
        before(function () {
            var transforms = [
                new transforms_1.RenameTypes(function (name) { return "Property_" + name; }),
            ];
            schema = transforms_1.transformSchema(testingSchemas_1.propertySchema, transforms);
        });
        it('should work', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          query($input: Property_InputWithDefault!) {\n            interfaceTest(kind: ONE) {\n              ... on Property_TestInterface {\n                testString\n              }\n            }\n            properties(limit: 1) {\n               __typename\n               id\n            }\n            propertyById(id: \"p1\") {\n              ... on Property_Property {\n                id\n              }\n            }\n            dateTimeTest\n            defaultInputTest(input: $input)\n          }\n        ", {}, {}, {
                            input: {
                                test: 'bar',
                            },
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            data: {
                                dateTimeTest: '1987-09-25T12:00:00',
                                defaultInputTest: 'bar',
                                interfaceTest: {
                                    testString: 'test',
                                },
                                properties: [
                                    {
                                        __typename: 'Property_Property',
                                        id: 'p1',
                                    }
                                ],
                                propertyById: {
                                    id: 'p1',
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('filter type', function () {
        var schema;
        before(function () {
            var typeNames = ['ID', 'String', 'DateTime', 'Query', 'Booking'];
            var transforms = [
                new transforms_1.FilterTypes(function (type) { return typeNames.indexOf(type.name) >= 0; }),
            ];
            schema = transforms_1.transformSchema(testingSchemas_1.bookingSchema, transforms);
        });
        it('should work normally', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          query {\n            bookingById(id: \"b1\") {\n              id\n              propertyId\n              startTime\n              endTime\n            }\n          }\n        ")];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            data: {
                                bookingById: {
                                    endTime: '2016-06-03',
                                    id: 'b1',
                                    propertyId: 'p1',
                                    startTime: '2016-05-04',
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should error on removed types', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          query {\n            bookingById(id: \"b1\") {\n              id\n              propertyId\n              startTime\n              endTime\n              customer {\n                id\n              }\n            }\n          }\n        ")];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            errors: [
                                {
                                    locations: [
                                        {
                                            column: 15,
                                            line: 8,
                                        },
                                    ],
                                    message: 'Cannot query field "customer" on type "Booking".',
                                    path: undefined,
                                },
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('tree operations', function () {
        var data;
        var subSchema;
        var schema;
        before(function () {
            data = {
                u1: {
                    id: 'u1',
                    username: 'alice',
                    address: {
                        streetAddress: 'Windy Shore 21 A 7',
                        zip: '12345',
                    },
                },
                u2: {
                    id: 'u2',
                    username: 'bob',
                    address: {
                        streetAddress: 'Snowy Mountain 5 B 77',
                        zip: '54321',
                    },
                },
            };
            subSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: "\n        type User {\n          id: ID!\n          username: String\n          address: Address\n        }\n\n        type Address {\n          streetAddress: String\n          zip: String\n        }\n\n        input UserInput {\n          id: ID!\n          username: String\n        }\n\n        input AddressInput {\n          id: ID!\n          streetAddress: String\n          zip: String\n        }\n\n        type Query {\n          userById(id: ID!): User\n        }\n\n        type Mutation {\n          setUser(input: UserInput!): User\n          setAddress(input: AddressInput!): Address\n        }\n      ",
                resolvers: {
                    Query: {
                        userById: function (parent, _a) {
                            var id = _a.id;
                            return data[id];
                        },
                    },
                    Mutation: {
                        setUser: function (parent, _a) {
                            var input = _a.input;
                            if (data[input.id]) {
                                return __assign({}, data[input.id], input);
                            }
                        },
                        setAddress: function (parent, _a) {
                            var input = _a.input;
                            if (data[input.id]) {
                                return __assign({}, data[input.id].address, input);
                            }
                        },
                    },
                },
            });
            schema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: "\n        type User {\n          id: ID!\n          username: String\n          address: Address\n        }\n\n        type Address {\n          streetAddress: String\n          zip: String\n        }\n\n        input UserInput {\n          id: ID!\n          username: String\n          streetAddress: String\n          zip: String\n        }\n\n        type Query {\n          addressByUser(id: ID!): Address\n        }\n\n        type Mutation {\n          setUserAndAddress(input: UserInput!): User\n        }\n      ",
                resolvers: {
                    Query: {
                        addressByUser: function (parent, _a, context, info) {
                            var id = _a.id;
                            return delegateToSchema_1.default({
                                schema: subSchema,
                                operation: 'query',
                                fieldName: 'userById',
                                args: { id: id },
                                context: context,
                                info: info,
                                transforms: [
                                    // Wrap document takes a subtree as an AST node
                                    new transforms_1.WrapQuery(
                                    // path at which to apply wrapping and extracting
                                    ['userById'], function (subtree) { return ({
                                        // we create a wrapping AST Field
                                        kind: graphql_1.Kind.FIELD,
                                        name: {
                                            kind: graphql_1.Kind.NAME,
                                            // that field is `address`
                                            value: 'address',
                                        },
                                        // Inside the field selection
                                        selectionSet: subtree,
                                    }); }, 
                                    // how to process the data result at path
                                    function (result) { return result && result.address; }),
                                ],
                            });
                        },
                    },
                    Mutation: {
                        setUserAndAddress: function (parent, _a, context, info) {
                            var input = _a.input;
                            return __awaiter(this, void 0, void 0, function () {
                                var addressResult, userResult;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, delegateToSchema_1.default({
                                                schema: subSchema,
                                                operation: 'mutation',
                                                fieldName: 'setAddress',
                                                args: {
                                                    input: {
                                                        id: input.id,
                                                        streetAddress: input.streetAddress,
                                                        zip: input.zip,
                                                    },
                                                },
                                                context: context,
                                                info: info,
                                                transforms: [
                                                    // ExtractField takes a path from which to extract the query
                                                    // for delegation and path to which to move it
                                                    new transforms_1.ExtractField({
                                                        from: ['setAddress', 'address'],
                                                        to: ['setAddress'],
                                                    }),
                                                ],
                                            })];
                                        case 1:
                                            addressResult = _b.sent();
                                            return [4 /*yield*/, delegateToSchema_1.default({
                                                    schema: subSchema,
                                                    operation: 'mutation',
                                                    fieldName: 'setUser',
                                                    args: {
                                                        input: {
                                                            id: input.id,
                                                            username: input.username,
                                                        },
                                                    },
                                                    context: context,
                                                    info: info,
                                                })];
                                        case 2:
                                            userResult = _b.sent();
                                            return [2 /*return*/, __assign({}, userResult, { address: addressResult })];
                                    }
                                });
                            });
                        },
                    },
                },
            });
        });
        it('wrapping delegation', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          query {\n            addressByUser(id: \"u1\") {\n              streetAddress\n              zip\n            }\n          }\n        ")];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            data: {
                                addressByUser: {
                                    streetAddress: 'Windy Shore 21 A 7',
                                    zip: '12345',
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('extracting delegation', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, graphql_1.graphql(schema, "\n          mutation($input: UserInput!) {\n            setUserAndAddress(input: $input) {\n              username\n              address {\n                zip\n                streetAddress\n              }\n            }\n          }\n\n          # fragment UserFragment on User {\n          #   address {\n          #     zip\n          #     ...AddressFragment\n          #   }\n          # }\n          #\n          # fragment AddressFragment on Address {\n          #   streetAddress\n          # }\n        ", {}, {}, {
                            input: {
                                id: 'u2',
                                username: 'new-username',
                                streetAddress: 'New Address 555',
                                zip: '22222',
                            },
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(result).to.deep.equal({
                            data: {
                                setUserAndAddress: {
                                    username: 'new-username',
                                    address: {
                                        streetAddress: 'New Address 555',
                                        zip: '22222',
                                    },
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=testTransforms.js.map