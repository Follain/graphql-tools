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
var mergeSchemas_1 = require("../stitching/mergeSchemas");
var testingSchemas_1 = require("./testingSchemas");
var iterall_1 = require("iterall");
var schemaGenerator_1 = require("../schemaGenerator");
var testCombinations = [
    {
        name: 'local',
        booking: testingSchemas_1.bookingSchema,
        property: testingSchemas_1.propertySchema,
        product: testingSchemas_1.productSchema,
    },
    {
        name: 'remote',
        booking: testingSchemas_1.remoteBookingSchema,
        property: testingSchemas_1.remotePropertySchema,
        product: testingSchemas_1.remoteProductSchema,
    },
    {
        name: 'hybrid',
        booking: testingSchemas_1.bookingSchema,
        property: testingSchemas_1.remotePropertySchema,
        product: testingSchemas_1.productSchema,
    },
];
var scalarTest = "\n  \"\"\"\n  Description of TestScalar.\n  \"\"\"\n  scalar TestScalar\n\n  \"\"\"\n  Description of AnotherNewScalar.\n  \"\"\"\n  scalar AnotherNewScalar\n\n  \"\"\"\n  A type that uses TestScalar.\n  \"\"\"\n  type TestingScalar {\n    value: TestScalar\n  }\n\n  type Query {\n    testingScalar: TestingScalar\n  }\n";
var enumTest = "\n  \"\"\"\n  A type that uses an Enum.\n  \"\"\"\n  enum Color {\n    RED\n  }\n\n  \"\"\"\n  A type that uses an Enum with a numeric constant.\n  \"\"\"\n  enum NumericEnum {\n    TEST\n  }\n\n  schema {\n    query: Query\n  }\n\n  type Query {\n    color: Color\n    numericEnum: NumericEnum\n  }\n";
var enumSchema;
if (process.env.GRAPHQL_VERSION !== '^0.11') {
    enumSchema = schemaGenerator_1.makeExecutableSchema({
        typeDefs: enumTest,
        resolvers: {
            Color: {
                RED: '#EA3232',
            },
            NumericEnum: {
                TEST: 1,
            },
            Query: {
                color: function () {
                    return '#EA3232';
                },
                numericEnum: function () {
                    return 1;
                },
            },
        },
    });
}
var linkSchema = "\n  \"\"\"\n  A new type linking the Property type.\n  \"\"\"\n  type LinkType {\n    test: String\n    \"\"\"\n    The property.\n    \"\"\"\n    property: Property\n  }\n\n  interface Node {\n    id: ID!\n  }\n\n  extend type Car implements Node {\n    fakeFieldToSatisfyOldGraphQLRemoveAfter12: String\n  }\n\n  extend type Bike implements Node {\n    fakeFieldToSatisfyOldGraphQLRemoveAfter12: String\n  }\n\n  extend type Booking implements Node {\n    \"\"\"\n    The property of the booking.\n    \"\"\"\n    property: Property\n  }\n\n  extend type Property implements Node {\n    \"\"\"\n    A list of bookings.\n    \"\"\"\n    bookings(\n      \"\"\"\n      The maximum number of bookings to retrieve.\n      \"\"\"\n      limit: Int\n    ): [Booking]\n  }\n\n  extend type Query {\n    delegateInterfaceTest: TestInterface\n    delegateArgumentTest(arbitraryArg: Int): Property\n    \"\"\"\n    A new field on the root query.\n    \"\"\"\n    linkTest: LinkType\n    node(id: ID!): Node\n    nodes: [Node]\n  }\n\n  extend type Customer implements Node\n";
var loneExtend = "\n  extend type Booking {\n    foo: String!\n  }\n";
var interfaceExtensionTest = "\n  # No-op for older versions since this feature does not yet exist\n  extend type DownloadableProduct {\n    filesize: Int\n  }\n";
if (['^0.11', '^0.12'].indexOf(process.env.GRAPHQL_VERSION) === -1) {
    interfaceExtensionTest = "\n    extend interface Downloadable {\n      filesize: Int\n    }\n\n    extend type DownloadableProduct {\n      filesize: Int\n    }\n  ";
}
if (process.env.GRAPHQL_VERSION === '^0.11') {
    scalarTest = "\n    # Description of TestScalar.\n    scalar TestScalar\n\n    # Description of AnotherNewScalar.\n    scalar AnotherNewScalar\n\n    # A type that uses TestScalar.\n    type TestingScalar {\n      value: TestScalar\n    }\n\n    type Query {\n      testingScalar: TestingScalar\n    }\n  ";
    enumTest = "\n    # A type that uses an Enum.\n    enum Color {\n      RED\n    }\n\n    # A type that uses an Enum with a numeric constant.\n    enum NumericEnum {\n      TEST\n    }\n\n    schema {\n      query: Query\n    }\n\n    type Query {\n      color: Color\n      numericEnum: NumericEnum\n    }\n  ";
    enumSchema = schemaGenerator_1.makeExecutableSchema({
        typeDefs: enumTest,
        resolvers: {
            Color: {
                RED: '#EA3232',
            },
            NumericEnum: {
                TEST: 1,
            },
            Query: {
                color: function () {
                    return '#EA3232';
                },
                numericEnum: function () {
                    return 1;
                },
            },
        },
    });
    linkSchema = "\n    # A new type linking the Property type.\n    type LinkType {\n      test: String\n      # The property.\n      property: Property\n    }\n\n    interface Node {\n      id: ID!\n    }\n\n    extend type Car implements Node {\n      fakeFieldToSatisfyOldGraphQL: String\n    }\n\n    extend type Bike implements Node {\n      fakeFieldToSatisfyOldGraphQL: String\n    }\n\n    extend type Booking implements Node {\n      # The property of the booking.\n      property: Property\n    }\n\n    extend type Property implements Node {\n      # A list of bookings.\n      bookings(\n        # The maximum number of bookings to retrieve.\n        limit: Int\n      ): [Booking]\n    }\n\n    extend type Query {\n      delegateInterfaceTest: TestInterface\n      delegateArgumentTest(arbitraryArg: Int): Property\n      # A new field on the root query.\n      linkTest: LinkType\n      node(id: ID!): Node\n      nodes: [Node]\n    }\n\n    extend type Customer implements Node {}\n  ";
}
// Miscellaneous typeDefs that exercise uncommon branches for the sake of
// code coverage.
var codeCoverageTypeDefs = "\n  interface SyntaxNode {\n    type: String\n  }\n\n  type Statement implements SyntaxNode {\n    type: String\n  }\n\n  type Expression implements SyntaxNode {\n    type: String\n  }\n\n  union ASTNode = Statement | Expression\n\n  enum Direction {\n    NORTH\n    SOUTH\n    EAST\n    WEST\n  }\n\n  input WalkingPlan {\n    steps: Int\n    direction: Direction\n  }\n";
testCombinations.forEach(function (combination) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        describe('merging ' + combination.name, function () {
            var mergedSchema, propertySchema, productSchema, bookingSchema;
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, combination.property];
                        case 1:
                            propertySchema = _a.sent();
                            return [4 /*yield*/, combination.booking];
                        case 2:
                            bookingSchema = _a.sent();
                            return [4 /*yield*/, combination.product];
                        case 3:
                            productSchema = _a.sent();
                            mergedSchema = mergeSchemas_1.default({
                                schemas: [
                                    propertySchema,
                                    bookingSchema,
                                    productSchema,
                                    scalarTest,
                                    interfaceExtensionTest,
                                    enumSchema,
                                    linkSchema,
                                    loneExtend,
                                    testingSchemas_1.subscriptionSchema,
                                    codeCoverageTypeDefs,
                                ],
                                resolvers: {
                                    Property: {
                                        bookings: {
                                            fragment: '... on Property { id }',
                                            resolve: function (parent, args, context, info) {
                                                // Use the old mergeInfo.delegate API just this once, to make
                                                // sure it continues to work.
                                                return info.mergeInfo.delegate('query', 'bookingsByPropertyId', {
                                                    propertyId: parent.id,
                                                    limit: args.limit ? args.limit : null,
                                                }, context, info);
                                            },
                                        },
                                    },
                                    Booking: {
                                        property: {
                                            fragment: 'fragment BookingFragment on Booking { propertyId }',
                                            resolve: function (parent, args, context, info) {
                                                return info.mergeInfo.delegateToSchema({
                                                    schema: propertySchema,
                                                    operation: 'query',
                                                    fieldName: 'propertyById',
                                                    args: {
                                                        id: parent.propertyId,
                                                    },
                                                    context: context,
                                                    info: info,
                                                });
                                            },
                                        },
                                    },
                                    DownloadableProduct: {
                                        filesize: function () {
                                            return 1024;
                                        },
                                    },
                                    LinkType: {
                                        property: {
                                            resolve: function (parent, args, context, info) {
                                                return info.mergeInfo.delegateToSchema({
                                                    schema: propertySchema,
                                                    operation: 'query',
                                                    fieldName: 'propertyById',
                                                    args: {
                                                        id: 'p1',
                                                    },
                                                    context: context,
                                                    info: info,
                                                });
                                            },
                                        },
                                    },
                                    Query: {
                                        delegateInterfaceTest: function (parent, args, context, info) {
                                            return info.mergeInfo.delegateToSchema({
                                                schema: propertySchema,
                                                operation: 'query',
                                                fieldName: 'interfaceTest',
                                                args: {
                                                    kind: 'ONE',
                                                },
                                                context: context,
                                                info: info,
                                            });
                                        },
                                        delegateArgumentTest: function (parent, args, context, info) {
                                            return info.mergeInfo.delegateToSchema({
                                                schema: propertySchema,
                                                operation: 'query',
                                                fieldName: 'propertyById',
                                                args: {
                                                    id: 'p1',
                                                },
                                                context: context,
                                                info: info,
                                            });
                                        },
                                        linkTest: function () {
                                            return {
                                                test: 'test',
                                            };
                                        },
                                        node: {
                                            // fragment doesn't work
                                            fragment: '... on Node { id }',
                                            resolve: function (parent, args, context, info) {
                                                if (args.id.startsWith('p')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: propertySchema,
                                                        operation: 'query',
                                                        fieldName: 'propertyById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else if (args.id.startsWith('b')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: bookingSchema,
                                                        operation: 'query',
                                                        fieldName: 'bookingById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else if (args.id.startsWith('c')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: bookingSchema,
                                                        operation: 'query',
                                                        fieldName: 'customerById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else {
                                                    throw new Error('invalid id');
                                                }
                                            },
                                        },
                                        nodes: function (parent, args, context, info) {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var bookings, properties;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, info.mergeInfo.delegateToSchema({
                                                                schema: bookingSchema,
                                                                operation: 'query',
                                                                fieldName: 'bookings',
                                                                context: context,
                                                                info: info,
                                                            })];
                                                        case 1:
                                                            bookings = _a.sent();
                                                            return [4 /*yield*/, info.mergeInfo.delegateToSchema({
                                                                    schema: propertySchema,
                                                                    operation: 'query',
                                                                    fieldName: 'properties',
                                                                    context: context,
                                                                    info: info,
                                                                })];
                                                        case 2:
                                                            properties = _a.sent();
                                                            return [2 /*return*/, bookings.concat(properties)];
                                                    }
                                                });
                                            });
                                        },
                                    },
                                },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('basic', function () {
                it('works with context', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(propertySchema, "\n            query {\n              contextTest(key: \"test\")\n            }\n          ", {}, {
                                    test: 'Foo',
                                })];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              contextTest(key: \"test\")\n            }\n          ", {}, {
                                        test: 'Foo',
                                    })];
                            case 2:
                                mergedResult = _a.sent();
                                chai_1.expect(propertyResult).to.deep.equal({
                                    data: {
                                        contextTest: '"Foo"',
                                    },
                                });
                                chai_1.expect(mergedResult).to.deep.equal(propertyResult);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('works with custom scalars', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(propertySchema, "\n            query {\n              dateTimeTest\n              test1: jsonTest(input: { foo: \"bar\" })\n              test2: jsonTest(input: 5)\n              test3: jsonTest(input: \"6\")\n            }\n          ")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              dateTimeTest\n              test1: jsonTest(input: { foo: \"bar\" })\n              test2: jsonTest(input: 5)\n              test3: jsonTest(input: \"6\")\n            }\n          ")];
                            case 2:
                                mergedResult = _a.sent();
                                chai_1.expect(propertyResult).to.deep.equal({
                                    data: {
                                        dateTimeTest: '1987-09-25T12:00:00',
                                        test1: { foo: 'bar' },
                                        test2: 5,
                                        test3: '6',
                                    },
                                });
                                chai_1.expect(mergedResult).to.deep.equal(propertyResult);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('works with custom enums', function () { return __awaiter(_this, void 0, void 0, function () {
                    var localSchema, enumResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                localSchema = schemaGenerator_1.makeExecutableSchema({
                                    typeDefs: enumTest,
                                    resolvers: {
                                        Color: {
                                            RED: '#EA3232',
                                        },
                                        NumericEnum: {
                                            TEST: 1,
                                        },
                                        Query: {
                                            color: function () {
                                                return '#EA3232';
                                            },
                                            numericEnum: function () {
                                                return 1;
                                            },
                                        },
                                    },
                                });
                                return [4 /*yield*/, graphql_1.graphql(localSchema, "\n            query {\n              color\n              numericEnum\n            }\n          ")];
                            case 1:
                                enumResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              color\n              numericEnum\n            }\n          ")];
                            case 2:
                                mergedResult = _a.sent();
                                chai_1.expect(enumResult).to.deep.equal({
                                    data: {
                                        color: 'RED',
                                        numericEnum: 'TEST',
                                    },
                                });
                                chai_1.expect(mergedResult).to.deep.equal(enumResult);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('queries', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment, bookingFragment, propertyResult, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment = "\npropertyById(id: \"p1\") {\n  id\n  name\n}\n  ";
                                bookingFragment = "\nbookingById(id: \"b1\") {\n  id\n  customer {\n    name\n  }\n  startTime\n  endTime\n}\n  ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "query { " + propertyFragment + " }")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "query { " + bookingFragment + " }")];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "query {\n      " + propertyFragment + "\n      " + bookingFragment + "\n    }")];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Technically mutations are not idempotent, but they are in our test schemas
                it('mutations', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mutationFragment, input, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mutationFragment = "\n      mutation Mutation($input: BookingInput!) {\n        addBooking(input: $input) {\n          id\n          customer {\n            name\n          }\n          startTime\n          endTime\n        }\n      }\n    ";
                                input = {
                                    propertyId: 'p1',
                                    customerId: 'c1',
                                    startTime: '2015-01-10',
                                    endTime: '2015-02-10',
                                };
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, mutationFragment, {}, {}, {
                                        input: input,
                                    })];
                            case 1:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, mutationFragment, {}, {}, {
                                        input: input,
                                    })];
                            case 2:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal(bookingResult);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('local subscriptions working in merged schema', function (done) {
                    var mockNotification = {
                        notifications: {
                            text: 'Hello world',
                        },
                    };
                    var subscription = graphql_1.parse("\n          subscription Subscription {\n            notifications {\n              text\n            }\n          }\n        ");
                    var notificationCnt = 0;
                    graphql_1.subscribe(mergedSchema, subscription)
                        .then(function (results) {
                        iterall_1.forAwaitEach(results, function (result) {
                            chai_1.expect(result).to.have.property('data');
                            chai_1.expect(result.data).to.deep.equal(mockNotification);
                            !notificationCnt++ ? done() : null;
                        }).catch(done);
                    })
                        .catch(done);
                    testingSchemas_1.subscriptionPubSub.publish(testingSchemas_1.subscriptionPubSubTrigger, mockNotification);
                });
                it('links in queries', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              firstProperty: propertyById(id: \"p2\") {\n                id\n                name\n                bookings {\n                  id\n                  customer {\n                    name\n                  }\n                }\n              }\n              secondProperty: propertyById(id: \"p3\") {\n                id\n                name\n                bookings {\n                  id\n                  customer {\n                    name\n                  }\n                }\n              }\n              booking: bookingById(id: \"b1\") {\n                id\n                customer {\n                  name\n                }\n                property {\n                  id\n                  name\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        firstProperty: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                },
                                            ],
                                        },
                                        secondProperty: {
                                            id: 'p3',
                                            name: 'BedBugs - The Affordable Hostel',
                                            bookings: [],
                                        },
                                        booking: {
                                            id: 'b1',
                                            customer: {
                                                name: 'Exampler Customer',
                                            },
                                            property: {
                                                id: 'p1',
                                                name: 'Super great hotel',
                                            },
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interfaces', function () { return __awaiter(_this, void 0, void 0, function () {
                    var query, propertyResult, mergedResult, delegateQuery, mergedDelegate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                query = "\n          query {\n            test1: interfaceTest(kind: ONE) {\n              __typename\n              kind\n              testString\n              ...on TestImpl1 {\n                foo\n              }\n              ...on TestImpl2 {\n                bar\n              }\n            }\n\n            test2: interfaceTest(kind: TWO) {\n              __typename\n              kind\n              testString\n              ...on TestImpl1 {\n                foo\n              }\n              ...on TestImpl2 {\n                bar\n              }\n            }\n          }\n        ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, query)];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, query)];
                            case 2:
                                mergedResult = _a.sent();
                                chai_1.expect(propertyResult).to.deep.equal({
                                    data: {
                                        test1: {
                                            __typename: 'TestImpl1',
                                            kind: 'ONE',
                                            testString: 'test',
                                            foo: 'foo',
                                        },
                                        test2: {
                                            __typename: 'TestImpl2',
                                            kind: 'TWO',
                                            testString: 'test',
                                            bar: 'bar',
                                        },
                                    },
                                });
                                chai_1.expect(mergedResult).to.deep.equal(propertyResult);
                                delegateQuery = "\n          query {\n            withTypeName: delegateInterfaceTest {\n              __typename\n              kind\n              testString\n            }\n            withoutTypeName: delegateInterfaceTest {\n              kind\n              testString\n            }\n          }\n        ";
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, delegateQuery)];
                            case 3:
                                mergedDelegate = _a.sent();
                                chai_1.expect(mergedDelegate).to.deep.equal({
                                    data: {
                                        withTypeName: {
                                            __typename: 'TestImpl1',
                                            kind: 'ONE',
                                            testString: 'test',
                                        },
                                        withoutTypeName: {
                                            kind: 'ONE',
                                            testString: 'test',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('unions', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              customerById(id: \"c1\") {\n                ... on Person {\n                  name\n                }\n                vehicle {\n                  ... on Bike {\n                    bikeType\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        customerById: {
                                            name: 'Exampler Customer',
                                            vehicle: { bikeType: 'MOUNTAIN' },
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('unions with alias', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              customerById(id: \"c1\") {\n                ... on Person {\n                  name\n                }\n                v1: vehicle {\n                  ... on Bike {\n                    bikeType\n                  }\n                }\n                v2: vehicle {\n                  ... on Bike {\n                    bikeType\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        customerById: {
                                            name: 'Exampler Customer',
                                            v1: { bikeType: 'MOUNTAIN' },
                                            v2: { bikeType: 'MOUNTAIN' },
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('unions implementing interface', function () { return __awaiter(_this, void 0, void 0, function () {
                    var query, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                query = "\n          query {\n            test1: unionTest(output: \"Interface\") {\n              ... on TestInterface {\n                kind\n                testString\n              }\n              ... on TestImpl1 {\n                foo\n              }\n              ... on UnionImpl {\n                someField\n              }\n            }\n\n            test2: unionTest(output: \"OtherStuff\") {\n              ... on TestInterface {\n                kind\n                testString\n              }\n              ... on TestImpl1 {\n                foo\n              }\n              ... on UnionImpl {\n                someField\n              }\n            }\n          }\n        ";
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, query)];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        test1: {
                                            kind: 'ONE',
                                            testString: 'test',
                                            foo: 'foo',
                                        },
                                        test2: {
                                            someField: 'Bar',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interfaces spread from top level functions', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              first: customerById(id: \"c1\") {\n                name\n                ... on Node {\n                  id\n                }\n              }\n\n              second: customerById(id: \"c1\") {\n                ...NodeFragment\n              }\n            }\n\n            fragment NodeFragment on Node {\n              id\n              ... on Customer {\n                name\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        first: {
                                            id: 'c1',
                                            name: 'Exampler Customer',
                                        },
                                        second: {
                                            id: 'c1',
                                            name: 'Exampler Customer',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('unions implementing an interface', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              customerById(id: \"c1\") {\n                ... on Person {\n                  name\n                }\n                vehicle {\n                  ... on Node {\n                    __typename\n                    id\n                  }\n                }\n                secondVehicle: vehicle {\n                  ...NodeFragment\n                }\n              }\n            }\n\n            fragment NodeFragment on Node {\n              id\n              __typename\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        customerById: {
                                            name: 'Exampler Customer',
                                            vehicle: { __typename: 'Bike', id: 'v1' },
                                            secondVehicle: { __typename: 'Bike', id: 'v1' },
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('input objects with default', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              one: defaultInputTest(input: {})\n              two: defaultInputTest(input: { test: \"Bar\" })\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        one: 'Foo',
                                        two: 'Bar',
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('deep links', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p2\") {\n                id\n                name\n                bookings {\n                  id\n                  customer {\n                    name\n                  }\n                  property {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                    property: {
                                                        id: 'p2',
                                                        name: 'Another great hotel',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('link arguments', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p1\") {\n                id\n                name\n                bookings(limit: 1) {\n                  id\n                  customer {\n                    name\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p1',
                                            name: 'Super great hotel',
                                            bookings: [
                                                {
                                                    id: 'b1',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('removes `isTypeOf` checks from proxied schemas', function () {
                    var Booking = mergedSchema.getType('Booking');
                    chai_1.expect(Booking.isTypeOf).to.equal(undefined);
                });
                it('should merge resolvers when passed an array of resolver objects', function () { return __awaiter(_this, void 0, void 0, function () {
                    var Scalars, Enums, PropertyResolvers, LinkResolvers, Query1, Query2, AsyncQuery, schema, mergedResult, expected;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                Scalars = {
                                    TestScalar: new graphql_1.GraphQLScalarType({
                                        name: 'TestScalar',
                                        description: undefined,
                                        serialize: function (value) { return value; },
                                        parseValue: function (value) { return value; },
                                        parseLiteral: function () { return null; },
                                    }),
                                };
                                Enums = {
                                    NumericEnum: {
                                        TEST: 1,
                                    },
                                    Color: {
                                        RED: '#EA3232',
                                    },
                                };
                                PropertyResolvers = {
                                    Property: {
                                        bookings: {
                                            fragment: 'fragment PropertyFragment on Property { id }',
                                            resolve: function (parent, args, context, info) {
                                                return info.mergeInfo.delegateToSchema({
                                                    schema: bookingSchema,
                                                    operation: 'query',
                                                    fieldName: 'bookingsByPropertyId',
                                                    args: {
                                                        propertyId: parent.id,
                                                        limit: args.limit ? args.limit : null,
                                                    },
                                                    context: context,
                                                    info: info,
                                                });
                                            },
                                        },
                                    },
                                };
                                LinkResolvers = {
                                    Booking: {
                                        property: {
                                            fragment: 'fragment BookingFragment on Booking { propertyId }',
                                            resolve: function (parent, args, context, info) {
                                                return info.mergeInfo.delegateToSchema({
                                                    schema: propertySchema,
                                                    operation: 'query',
                                                    fieldName: 'propertyById',
                                                    args: {
                                                        id: parent.propertyId,
                                                    },
                                                    context: context,
                                                    info: info,
                                                });
                                            },
                                        },
                                    },
                                };
                                Query1 = {
                                    Query: {
                                        color: function () {
                                            return '#EA3232';
                                        },
                                        numericEnum: function () {
                                            return 1;
                                        },
                                    },
                                };
                                Query2 = {
                                    Query: {
                                        delegateInterfaceTest: function (parent, args, context, info) {
                                            return info.mergeInfo.delegateToSchema({
                                                schema: propertySchema,
                                                operation: 'query',
                                                fieldName: 'interfaceTest',
                                                args: {
                                                    kind: 'ONE',
                                                },
                                                context: context,
                                                info: info,
                                            });
                                        },
                                        delegateArgumentTest: function (parent, args, context, info) {
                                            return info.mergeInfo.delegateToSchema({
                                                schema: propertySchema,
                                                operation: 'query',
                                                fieldName: 'propertyById',
                                                args: {
                                                    id: 'p1',
                                                },
                                                context: context,
                                                info: info,
                                            });
                                        },
                                        linkTest: function () {
                                            return {
                                                test: 'test',
                                            };
                                        },
                                        node: {
                                            // fragment doesn't work
                                            fragment: 'fragment NodeFragment on Node { id }',
                                            resolve: function (parent, args, context, info) {
                                                if (args.id.startsWith('p')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: propertySchema,
                                                        operation: 'query',
                                                        fieldName: 'propertyById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else if (args.id.startsWith('b')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: bookingSchema,
                                                        operation: 'query',
                                                        fieldName: 'bookingById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else if (args.id.startsWith('c')) {
                                                    return info.mergeInfo.delegateToSchema({
                                                        schema: bookingSchema,
                                                        operation: 'query',
                                                        fieldName: 'customerById',
                                                        args: args,
                                                        context: context,
                                                        info: info,
                                                    });
                                                }
                                                else {
                                                    throw new Error('invalid id');
                                                }
                                            },
                                        },
                                    },
                                };
                                AsyncQuery = {
                                    Query: {
                                        nodes: function (parent, args, context, info) {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var bookings, properties;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, info.mergeInfo.delegateToSchema({
                                                                schema: bookingSchema,
                                                                operation: 'query',
                                                                fieldName: 'bookings',
                                                                context: context,
                                                                info: info,
                                                            })];
                                                        case 1:
                                                            bookings = _a.sent();
                                                            return [4 /*yield*/, info.mergeInfo.delegateToSchema({
                                                                    schema: propertySchema,
                                                                    operation: 'query',
                                                                    fieldName: 'properties',
                                                                    context: context,
                                                                    info: info,
                                                                })];
                                                        case 2:
                                                            properties = _a.sent();
                                                            return [2 /*return*/, bookings.concat(properties)];
                                                    }
                                                });
                                            });
                                        },
                                    },
                                };
                                schema = mergeSchemas_1.default({
                                    schemas: [
                                        propertySchema,
                                        bookingSchema,
                                        productSchema,
                                        scalarTest,
                                        enumSchema,
                                        linkSchema,
                                        loneExtend,
                                        testingSchemas_1.subscriptionSchema,
                                    ],
                                    resolvers: [
                                        Scalars,
                                        Enums,
                                        PropertyResolvers,
                                        LinkResolvers,
                                        Query1,
                                        Query2,
                                        AsyncQuery,
                                    ],
                                });
                                return [4 /*yield*/, graphql_1.graphql(schema, "\n            query {\n              dateTimeTest\n              test1: jsonTest(input: { foo: \"bar\" })\n              test2: jsonTest(input: 5)\n              test3: jsonTest(input: \"6\")\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                expected = {
                                    data: {
                                        dateTimeTest: '1987-09-25T12:00:00',
                                        test1: { foo: 'bar' },
                                        test2: 5,
                                        test3: '6',
                                    },
                                };
                                chai_1.expect(mergedResult).to.deep.equal(expected);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('fragments', function () {
                it('named', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment, bookingFragment, propertyResult, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment = "\nfragment PropertyFragment on Property {\n  id\n  name\n  location {\n    name\n  }\n}\n    ";
                                bookingFragment = "\nfragment BookingFragment on Booking {\n  id\n  customer {\n    name\n  }\n  startTime\n  endTime\n}\n    ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "\n            " + propertyFragment + "\n            query {\n              propertyById(id: \"p1\") {\n                ...PropertyFragment\n              }\n            }\n          ")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "\n            " + bookingFragment + "\n            query {\n              bookingById(id: \"b1\") {\n                ...BookingFragment\n              }\n            }\n          ")];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            " + bookingFragment + "\n            " + propertyFragment + "\n\n            query {\n              propertyById(id: \"p1\") {\n                ...PropertyFragment\n              }\n              bookingById(id: \"b1\") {\n                ...BookingFragment\n              }\n            }\n          ")];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('inline', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment, bookingFragment, propertyResult, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment = "\npropertyById(id: \"p1\") {\n  ... on Property {\n    id\n  }\n  name\n}\n  ";
                                bookingFragment = "\nbookingById(id: \"b1\") {\n  id\n  ... on Booking {\n    customer {\n      name\n    }\n    startTime\n    endTime\n  }\n}\n  ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "query { " + propertyFragment + " }")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "query { " + bookingFragment + " }")];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "query {\n      " + propertyFragment + "\n      " + bookingFragment + "\n    }")];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('containing links', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p2\") {\n                id\n                ... on Property {\n                  name\n                  bookings {\n                    id\n                    customer {\n                      name\n                    }\n                    ...BookingFragment\n                  }\n                }\n              }\n            }\n\n            fragment BookingFragment on Booking {\n              property {\n                ...PropertyFragment\n              }\n            }\n\n            fragment PropertyFragment on Property {\n              id\n              name\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                    property: {
                                                        id: 'p2',
                                                        name: 'Another great hotel',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('overlapping selections', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment1, propertyFragment2, bookingFragment, propertyResult, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment1 = "\nfragment PropertyFragment1 on Property {\n  id\n  name\n  location {\n    name\n  }\n}\n    ";
                                propertyFragment2 = "\nfragment PropertyFragment2 on Property {\n  id\n  name\n  location {\n    name\n  }\n}\n    ";
                                bookingFragment = "\nfragment BookingFragment on Booking {\n  id\n  customer {\n    name\n  }\n  startTime\n  endTime\n}\n    ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "\n            " + propertyFragment1 + "\n            " + propertyFragment2 + "\n            query {\n              propertyById(id: \"p1\") {\n                ...PropertyFragment1\n                ...PropertyFragment2\n              }\n            }\n          ")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "\n            " + bookingFragment + "\n            query {\n              bookingById(id: \"b1\") {\n                ...BookingFragment\n              }\n            }\n          ")];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            " + bookingFragment + "\n            " + propertyFragment1 + "\n            " + propertyFragment2 + "\n\n            query {\n              propertyById(id: \"p1\") {\n                ...PropertyFragment1\n                ...PropertyFragment2\n              }\n              bookingById(id: \"b1\") {\n                ...BookingFragment\n              }\n            }\n          ")];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('containing fragment on outer type', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p2\") {\n                id\n                ... on Property {\n                  name\n                  ...BookingFragment1\n                }\n              }\n            }\n\n            fragment BookingFragment1 on Property {\n              bookings {\n                id\n                property {\n                  id\n                  name\n                }\n              }\n              ...BookingFragment2\n            }\n\n            fragment BookingFragment2 on Property {\n              bookings {\n                customer {\n                  name\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                    property: {
                                                        id: 'p2',
                                                        name: 'Another great hotel',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('containing links and overlapping fragments on relation', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p2\") {\n                id\n                ... on Property {\n                  name\n                  ...BookingFragment1\n                  ...BookingFragment2\n                }\n              }\n            }\n\n            fragment BookingFragment1 on Property {\n              bookings {\n                id\n                property {\n                  id\n                  name\n                }\n              }\n            }\n\n            fragment BookingFragment2 on Property {\n              bookings {\n                customer {\n                  name\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                    property: {
                                                        id: 'p2',
                                                        name: 'Another great hotel',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('containing links and single fragment on relation', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p2\") {\n                id\n                ... on Property {\n                  name\n                  ...BookingFragment\n                }\n              }\n            }\n\n            fragment BookingFragment on Property {\n              bookings {\n                id\n                customer {\n                  name\n                }\n                property {\n                  id\n                  name\n                }\n              }\n            }\n          ")];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p2',
                                            name: 'Another great hotel',
                                            bookings: [
                                                {
                                                    id: 'b4',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                    },
                                                    property: {
                                                        id: 'p2',
                                                        name: 'Another great hotel',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('variables', function () {
                it('basic', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment, bookingFragment, propertyResult, bookingResult, mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment = "\n          propertyById(id: $p1) {\n            id\n            name\n          }\n        ";
                                bookingFragment = "\n          bookingById(id: $b1) {\n            id\n            customer {\n              name\n            }\n            startTime\n            endTime\n          }\n        ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "query($p1: ID!) { " + propertyFragment + " }", {}, {}, {
                                        p1: 'p1',
                                    })];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "query($b1: ID!) { " + bookingFragment + " }", {}, {}, {
                                        b1: 'b1',
                                    })];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "query($p1: ID!, $b1: ID!) {\n        " + propertyFragment + "\n        " + bookingFragment + "\n      }", {}, {}, {
                                        p1: 'p1',
                                        b1: 'b1',
                                    })];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('in link selections', function () { return __awaiter(_this, void 0, void 0, function () {
                    var mergedResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query($limit: Int) {\n              propertyById(id: \"p1\") {\n                id\n                name\n                ... on Property {\n                  bookings(limit: $limit) {\n                    id\n                    customer {\n                      name\n                      ... on Person {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          ", {}, {}, {
                                    limit: 1,
                                })];
                            case 1:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            id: 'p1',
                                            name: 'Super great hotel',
                                            bookings: [
                                                {
                                                    id: 'b1',
                                                    customer: {
                                                        name: 'Exampler Customer',
                                                        id: 'c1',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('aliases', function () {
                it('aliases', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              property: propertyById(id: \"p1\") {\n                id\n                propertyId: id\n                secondAlias: id\n                firstReservation: bookings(limit: 1) {\n                  id\n                }\n                reservations: bookings {\n                  bookingId: id\n                  user: customer {\n                    customerId: id\n                  }\n                  hotel: property {\n                    propertyId: id\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        property: {
                                            id: 'p1',
                                            propertyId: 'p1',
                                            secondAlias: 'p1',
                                            firstReservation: [
                                                {
                                                    id: 'b1',
                                                },
                                            ],
                                            reservations: [
                                                {
                                                    bookingId: 'b1',
                                                    user: {
                                                        customerId: 'c1',
                                                    },
                                                    hotel: {
                                                        propertyId: 'p1',
                                                    },
                                                },
                                                {
                                                    bookingId: 'b2',
                                                    hotel: {
                                                        propertyId: 'p1',
                                                    },
                                                    user: {
                                                        customerId: 'c2',
                                                    },
                                                },
                                                {
                                                    bookingId: 'b3',
                                                    hotel: {
                                                        propertyId: 'p1',
                                                    },
                                                    user: {
                                                        customerId: 'c3',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('aliases subschema queries', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              customerById(id: \"c1\") {\n                id\n                firstBooking: bookings(limit: 1) {\n                  id\n                  property {\n                    id\n                  }\n                }\n                allBookings: bookings(limit: 10) {\n                  id\n                  property {\n                    id\n                  }\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        customerById: {
                                            id: 'c1',
                                            firstBooking: [
                                                {
                                                    id: 'b1',
                                                    property: {
                                                        id: 'p1',
                                                    },
                                                },
                                            ],
                                            allBookings: [
                                                {
                                                    id: 'b1',
                                                    property: {
                                                        id: 'p1',
                                                    },
                                                },
                                                {
                                                    id: 'b4',
                                                    property: {
                                                        id: 'p2',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('errors', function () {
                it('root level', function () { return __awaiter(_this, void 0, void 0, function () {
                    var propertyFragment, bookingFragment, propertyResult, bookingResult, mergedResult, mergedResult2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                propertyFragment = "\n                errorTest\n              ";
                                bookingFragment = "\n          bookingById(id: \"b1\") {\n            id\n            customer {\n              name\n            }\n            startTime\n            endTime\n          }\n        ";
                                return [4 /*yield*/, graphql_1.graphql(propertySchema, "query {\n                  " + propertyFragment + "\n                }")];
                            case 1:
                                propertyResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(bookingSchema, "query {\n                  " + bookingFragment + "\n                }")];
                            case 2:
                                bookingResult = _a.sent();
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "query {\n            " + propertyFragment + "\n            " + bookingFragment + "\n          }")];
                            case 3:
                                mergedResult = _a.sent();
                                chai_1.expect(mergedResult).to.deep.equal({
                                    errors: propertyResult.errors,
                                    data: __assign({}, propertyResult.data, bookingResult.data),
                                });
                                return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n                query {\n                  errorTestNonNull\n                  " + bookingFragment + "\n                }\n              ")];
                            case 4:
                                mergedResult2 = _a.sent();
                                chai_1.expect(mergedResult2).to.deep.equal({
                                    errors: [
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 3,
                                                },
                                            ],
                                            message: 'Sample error non-null!',
                                            path: ['errorTestNonNull'],
                                        },
                                    ],
                                    data: null,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('nested errors', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              propertyById(id: \"p1\") {\n                error\n                errorAlias: error\n                bookings {\n                  id\n                  error\n                  bookingErrorAlias: error\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        propertyById: {
                                            bookings: [
                                                {
                                                    bookingErrorAlias: null,
                                                    error: null,
                                                    id: 'b1',
                                                },
                                                {
                                                    bookingErrorAlias: null,
                                                    error: null,
                                                    id: 'b2',
                                                },
                                                {
                                                    bookingErrorAlias: null,
                                                    error: null,
                                                    id: 'b3',
                                                },
                                            ],
                                            error: null,
                                            errorAlias: null,
                                        },
                                    },
                                    errors: [
                                        {
                                            locations: [
                                                {
                                                    column: 17,
                                                    line: 4,
                                                },
                                            ],
                                            message: 'Property.error error',
                                            path: ['propertyById', 'error'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 17,
                                                    line: 5,
                                                },
                                            ],
                                            message: 'Property.error error',
                                            path: ['propertyById', 'errorAlias'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 8,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 0, 'error'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 9,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 0, 'bookingErrorAlias'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 8,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 1, 'error'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 9,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 1, 'bookingErrorAlias'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 8,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 2, 'error'],
                                        },
                                        {
                                            locations: [
                                                {
                                                    column: 19,
                                                    line: 9,
                                                },
                                            ],
                                            message: 'Booking.error error',
                                            path: ['propertyById', 'bookings', 2, 'bookingErrorAlias'],
                                        },
                                    ],
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('types in schema extensions', function () {
                it('should parse descriptions on new types', function () {
                    chai_1.expect(mergedSchema.getType('AnotherNewScalar').description).to.equal('Description of AnotherNewScalar.');
                    chai_1.expect(mergedSchema.getType('TestingScalar').description).to.equal('A type that uses TestScalar.');
                    chai_1.expect(mergedSchema.getType('Color').description).to.equal('A type that uses an Enum.');
                    chai_1.expect(mergedSchema.getType('NumericEnum').description).to.equal('A type that uses an Enum with a numeric constant.');
                    chai_1.expect(mergedSchema.getType('LinkType').description).to.equal('A new type linking the Property type.');
                    chai_1.expect(mergedSchema.getType('LinkType').description).to.equal('A new type linking the Property type.');
                });
                it('should parse descriptions on new fields', function () {
                    var Query = mergedSchema.getQueryType();
                    chai_1.expect(Query.getFields().linkTest.description).to.equal('A new field on the root query.');
                    var Booking = mergedSchema.getType('Booking');
                    chai_1.expect(Booking.getFields().property.description).to.equal('The property of the booking.');
                    var Property = mergedSchema.getType('Property');
                    var bookingsField = Property.getFields().bookings;
                    chai_1.expect(bookingsField.description).to.equal('A list of bookings.');
                    chai_1.expect(bookingsField.args[0].description).to.equal('The maximum number of bookings to retrieve.');
                });
                it('should allow defining new types in link type', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              linkTest {\n                test\n                property {\n                  id\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        linkTest: {
                                            test: 'test',
                                            property: {
                                                id: 'p1',
                                            },
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('merge info defined interfaces', function () {
                it('inline fragments on existing types in subschema', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query($pid: ID!, $bid: ID!) {\n              property: node(id: $pid) {\n                id\n                ... on Property {\n                  name\n                }\n              }\n              booking: node(id: $bid) {\n                id\n                ... on Booking {\n                  startTime\n                  endTime\n                }\n              }\n            }\n          ", {}, {}, {
                                    pid: 'p1',
                                    bid: 'b1',
                                })];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        property: {
                                            id: 'p1',
                                            name: 'Super great hotel',
                                        },
                                        booking: {
                                            id: 'b1',
                                            startTime: '2016-05-04',
                                            endTime: '2016-06-03',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('inline fragments on non-compatible sub schema types', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query($bid: ID!) {\n              node(id: $bid) {\n                __typename\n                id\n                ... on Property {\n                  name\n                }\n                ... on Booking {\n                  startTime\n                  endTime\n                }\n                ... on Customer {\n                  name\n                }\n              }\n            }\n          ", {}, {}, {
                                    bid: 'b1',
                                })];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        node: {
                                            __typename: 'Booking',
                                            id: 'b1',
                                            startTime: '2016-05-04',
                                            endTime: '2016-06-03',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fragments on non-compatible sub schema types', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query($bid: ID!) {\n              node(id: $bid) {\n                __typename\n                id\n                ...PropertyFragment\n                ...BookingFragment\n                ...CustomerFragment\n              }\n            }\n\n            fragment PropertyFragment on Property {\n              name\n            }\n\n            fragment BookingFragment on Booking {\n              startTime\n              endTime\n            }\n\n            fragment CustomerFragment on Customer {\n              name\n            }\n          ", {}, {}, {
                                    bid: 'b1',
                                })];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        node: {
                                            __typename: 'Booking',
                                            id: 'b1',
                                            startTime: '2016-05-04',
                                            endTime: '2016-06-03',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fragments on interfaces in merged schema', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query($bid: ID!) {\n              node(id: $bid) {\n                ...NodeFragment\n              }\n            }\n\n            fragment NodeFragment on Node {\n              id\n              ... on Property {\n                name\n              }\n              ... on Booking {\n                startTime\n                endTime\n              }\n            }\n          ", {}, {}, {
                                    bid: 'b1',
                                })];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        node: {
                                            id: 'b1',
                                            startTime: '2016-05-04',
                                            endTime: '2016-06-03',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multi-interface filter', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              products {\n                id\n                __typename\n                ... on Sellable {\n                  price\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        products: [
                                            {
                                                id: 'pd1',
                                                __typename: 'SimpleProduct',
                                                price: 100,
                                            },
                                            {
                                                id: 'pd2',
                                                __typename: 'DownloadableProduct',
                                            },
                                        ],
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (['^0.11', '^0.12'].indexOf(process.env.GRAPHQL_VERSION) === -1) {
                    it('interface extensions', function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n              query {\n                products {\n                  id\n                  __typename\n                  ... on Downloadable {\n                    filesize\n                  }\n                }\n              }\n            ")];
                                case 1:
                                    result = _a.sent();
                                    chai_1.expect(result).to.deep.equal({
                                        data: {
                                            products: [
                                                {
                                                    id: 'pd1',
                                                    __typename: 'SimpleProduct',
                                                },
                                                {
                                                    id: 'pd2',
                                                    __typename: 'DownloadableProduct',
                                                    filesize: 1024,
                                                },
                                            ],
                                        },
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                it('arbitrary transforms that return interfaces', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              nodes {\n                id\n                ... on Property {\n                  name\n                }\n                ... on Booking {\n                  startTime\n                  endTime\n                }\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        nodes: [
                                            {
                                                id: 'b1',
                                                startTime: '2016-05-04',
                                                endTime: '2016-06-03',
                                            },
                                            {
                                                id: 'b2',
                                                startTime: '2016-06-04',
                                                endTime: '2016-07-03',
                                            },
                                            {
                                                id: 'b3',
                                                startTime: '2016-08-04',
                                                endTime: '2016-09-03',
                                            },
                                            {
                                                id: 'b4',
                                                startTime: '2016-10-04',
                                                endTime: '2016-10-03',
                                            },
                                            {
                                                id: 'p1',
                                                name: 'Super great hotel',
                                            },
                                            {
                                                id: 'p2',
                                                name: 'Another great hotel',
                                            },
                                            {
                                                id: 'p3',
                                                name: 'BedBugs - The Affordable Hostel',
                                            },
                                        ],
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('regression', function () {
                it('should not pass extra arguments to delegates', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n            query {\n              delegateArgumentTest(arbitraryArg: 5) {\n                id\n              }\n            }\n          ")];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        delegateArgumentTest: {
                                            id: 'p1',
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=testMergeSchemas.js.map