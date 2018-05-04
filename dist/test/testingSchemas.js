"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var apollo_link_1 = require("apollo-link");
var schemaGenerator_1 = require("../schemaGenerator");
var makeRemoteExecutableSchema_1 = require("../stitching/makeRemoteExecutableSchema");
var introspectSchema_1 = require("../stitching/introspectSchema");
var graphql_subscriptions_1 = require("graphql-subscriptions");
exports.sampleData = {
    Product: {
        pd1: {
            id: 'pd1',
            type: 'simple',
            price: 100,
        },
        pd2: {
            id: 'pd2',
            type: 'download',
            url: 'https://graphql.org',
        },
    },
    Property: {
        p1: {
            id: 'p1',
            name: 'Super great hotel',
            location: {
                name: 'Helsinki',
            },
        },
        p2: {
            id: 'p2',
            name: 'Another great hotel',
            location: {
                name: 'San Francisco',
            },
        },
        p3: {
            id: 'p3',
            name: 'BedBugs - The Affordable Hostel',
            location: {
                name: 'Helsinki',
            },
        },
    },
    Booking: {
        b1: {
            id: 'b1',
            propertyId: 'p1',
            customerId: 'c1',
            startTime: '2016-05-04',
            endTime: '2016-06-03',
        },
        b2: {
            id: 'b2',
            propertyId: 'p1',
            customerId: 'c2',
            startTime: '2016-06-04',
            endTime: '2016-07-03',
        },
        b3: {
            id: 'b3',
            propertyId: 'p1',
            customerId: 'c3',
            startTime: '2016-08-04',
            endTime: '2016-09-03',
        },
        b4: {
            id: 'b4',
            propertyId: 'p2',
            customerId: 'c1',
            startTime: '2016-10-04',
            endTime: '2016-10-03',
        },
    },
    Customer: {
        c1: {
            id: 'c1',
            email: 'examplec1@example.com',
            name: 'Exampler Customer',
            vehicleId: 'v1',
        },
        c2: {
            id: 'c2',
            email: 'examplec2@example.com',
            name: 'Joe Doe',
            vehicleId: 'v2',
        },
        c3: {
            id: 'c3',
            email: 'examplec3@example.com',
            name: 'Liisa Esimerki',
            address: 'Esimerkikatu 1 A 77, 99999 Kyyjarvi',
        },
    },
    Vehicle: {
        v1: {
            id: 'v1',
            bikeType: 'MOUNTAIN',
        },
        v2: {
            id: 'v2',
            licensePlate: 'GRAPHQL',
        },
    },
};
function values(o) {
    return Object.keys(o).map(function (k) { return o[k]; });
}
function coerceString(value) {
    if (Array.isArray(value)) {
        throw new TypeError("String cannot represent an array value: [" + String(value) + "]");
    }
    return String(value);
}
var DateTime = new graphql_1.GraphQLScalarType({
    name: 'DateTime',
    description: 'Simple fake datetime',
    serialize: coerceString,
    parseValue: coerceString,
    parseLiteral: function (ast) {
        return ast.kind === graphql_1.Kind.STRING ? ast.value : null;
    },
});
function identity(value) {
    return value;
}
function parseLiteral(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.OBJECT: {
            var value_1 = Object.create(null);
            ast.fields.forEach(function (field) {
                value_1[field.name.value] = parseLiteral(field.value);
            });
            return value_1;
        }
        case graphql_1.Kind.LIST:
            return ast.values.map(parseLiteral);
        default:
            return null;
    }
}
var GraphQLJSON = new graphql_1.GraphQLScalarType({
    name: 'JSON',
    description: 'The `JSON` scalar type represents JSON values as specified by ' +
        '[ECMA-404](http://www.ecma-international.org/' +
        'publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: identity,
    parseValue: identity,
    parseLiteral: parseLiteral,
});
var addressTypeDef = "\n  type Address {\n    street: String\n    city: String\n    state: String\n    zip: String\n  }\n";
var propertyAddressTypeDef = "\n  type Property {\n    id: ID!\n    name: String!\n    location: Location\n    address: Address\n    error: String\n  }\n";
var propertyRootTypeDefs = "\n  type Location {\n    name: String!\n  }\n\n  enum TestInterfaceKind {\n    ONE\n    TWO\n  }\n\n  interface TestInterface {\n    kind: TestInterfaceKind\n    testString: String\n  }\n\n  type TestImpl1 implements TestInterface {\n    kind: TestInterfaceKind\n    testString: String\n    foo: String\n  }\n\n  type TestImpl2 implements TestInterface {\n    kind: TestInterfaceKind\n    testString: String\n    bar: String\n  }\n\n  type UnionImpl {\n    someField: String\n  }\n\n  union TestUnion = TestImpl1 | UnionImpl\n\n  input InputWithDefault {\n    test: String = \"Foo\"\n  }\n\n  type Query {\n    propertyById(id: ID!): Property\n    properties(limit: Int): [Property!]\n    contextTest(key: String!): String\n    dateTimeTest: DateTime\n    jsonTest(input: JSON): JSON\n    interfaceTest(kind: TestInterfaceKind): TestInterface\n    unionTest(output: String): TestUnion\n    errorTest: String\n    errorTestNonNull: String!\n    relay: Query!\n    defaultInputTest(input: InputWithDefault!): String\n  }\n";
var propertyAddressTypeDefs = "\n  scalar DateTime\n  scalar JSON\n\n  " + addressTypeDef + "\n  " + propertyAddressTypeDef + "\n  " + propertyRootTypeDefs + "\n";
var propertyResolvers = {
    Query: {
        propertyById: function (root, _a) {
            var id = _a.id;
            return exports.sampleData.Property[id];
        },
        properties: function (root, _a) {
            var limit = _a.limit;
            var list = values(exports.sampleData.Property);
            if (limit) {
                return list.slice(0, limit);
            }
            else {
                return list;
            }
        },
        contextTest: function (root, args, context) {
            return JSON.stringify(context[args.key]);
        },
        dateTimeTest: function () {
            return '1987-09-25T12:00:00';
        },
        jsonTest: function (root, _a) {
            var input = _a.input;
            return input;
        },
        interfaceTest: function (root, _a) {
            var kind = _a.kind;
            if (kind === 'ONE') {
                return {
                    kind: 'ONE',
                    testString: 'test',
                    foo: 'foo',
                };
            }
            else {
                return {
                    kind: 'TWO',
                    testString: 'test',
                    bar: 'bar',
                };
            }
        },
        unionTest: function (root, _a) {
            var output = _a.output;
            if (output === 'Interface') {
                return {
                    kind: 'ONE',
                    testString: 'test',
                    foo: 'foo',
                };
            }
            else {
                return {
                    someField: 'Bar',
                };
            }
        },
        errorTest: function () {
            throw new Error('Sample error!');
        },
        errorTestNonNull: function () {
            throw new Error('Sample error non-null!');
        },
        defaultInputTest: function (parent, _a) {
            var input = _a.input;
            return input.test;
        },
    },
    DateTime: DateTime,
    JSON: GraphQLJSON,
    TestInterface: {
        __resolveType: function (obj) {
            if (obj.kind === 'ONE') {
                return 'TestImpl1';
            }
            else {
                return 'TestImpl2';
            }
        },
    },
    TestUnion: {
        __resolveType: function (obj) {
            if (obj.kind === 'ONE') {
                return 'TestImpl1';
            }
            else {
                return 'UnionImpl';
            }
        },
    },
    Property: {
        error: function () {
            throw new Error('Property.error error');
        },
    },
};
var DownloadableProduct = "\n  type DownloadableProduct implements Product & Downloadable {\n    id: ID!\n    url: String!\n  }\n";
var SimpleProduct = "type SimpleProduct implements Product & Sellable {\n    id: ID!\n    price: Int!\n  }\n";
if (['^0.11', '^0.12'].indexOf(process.env.GRAPHQL_VERSION) !== -1) {
    DownloadableProduct = "\n    type DownloadableProduct implements Product, Downloadable {\n      id: ID!\n      url: String!\n    }\n  ";
    SimpleProduct = "type SimpleProduct implements Product, Sellable {\n      id: ID!\n      price: Int!\n    }\n  ";
}
var productTypeDefs = "\n  interface Product {\n    id: ID!\n  }\n\n  interface Sellable {\n    price: Int!\n  }\n\n  interface Downloadable {\n    url: String!\n  }\n\n  " + SimpleProduct + "\n  " + DownloadableProduct + "\n\n  type Query {\n    products: [Product]\n  }\n";
var productResolvers = {
    Query: {
        products: function (root) {
            var list = values(exports.sampleData.Product);
            return list;
        },
    },
    Product: {
        __resolveType: function (obj) {
            if (obj.type === 'simple') {
                return 'SimpleProduct';
            }
            else {
                return 'DownloadableProduct';
            }
        },
    },
};
var customerAddressTypeDef = "\n  type Customer implements Person {\n    id: ID!\n    email: String!\n    name: String!\n    address: Address\n    bookings(limit: Int): [Booking!]\n    vehicle: Vehicle\n    error: String\n  }\n";
var bookingRootTypeDefs = "\n  scalar DateTime\n\n  type Booking {\n    id: ID!\n    propertyId: ID!\n    customer: Customer!\n    startTime: String!\n    endTime: String!\n    error: String\n    errorNonNull: String!\n  }\n\n  interface Person {\n    id: ID!\n    name: String!\n  }\n\n  union Vehicle = Bike | Car\n\n  type Bike {\n    id: ID!\n    bikeType: String\n  }\n\n  type Car  {\n    id: ID!\n    licensePlate: String\n  }\n\n  type Query {\n    bookingById(id: ID!): Booking\n    bookingsByPropertyId(propertyId: ID!, limit: Int): [Booking!]\n    customerById(id: ID!): Customer\n    bookings(limit: Int): [Booking!]\n    customers(limit: Int): [Customer!]\n  }\n\n  input BookingInput {\n    propertyId: ID!\n    customerId: ID!\n    startTime: DateTime!\n    endTime: DateTime!\n  }\n\n  type Mutation {\n    addBooking(input: BookingInput): Booking\n  }\n";
var bookingAddressTypeDefs = "\n  " + addressTypeDef + "\n  " + customerAddressTypeDef + "\n  " + bookingRootTypeDefs + "\n";
var bookingResolvers = {
    Query: {
        bookingById: function (parent, _a) {
            var id = _a.id;
            return exports.sampleData.Booking[id];
        },
        bookingsByPropertyId: function (parent, _a) {
            var propertyId = _a.propertyId, limit = _a.limit;
            var list = values(exports.sampleData.Booking).filter(function (booking) { return booking.propertyId === propertyId; });
            if (limit) {
                return list.slice(0, limit);
            }
            else {
                return list;
            }
        },
        customerById: function (parent, _a) {
            var id = _a.id;
            return exports.sampleData.Customer[id];
        },
        bookings: function (parent, _a) {
            var limit = _a.limit;
            var list = values(exports.sampleData.Booking);
            if (limit) {
                return list.slice(0, limit);
            }
            else {
                return list;
            }
        },
        customers: function (parent, _a) {
            var limit = _a.limit;
            var list = values(exports.sampleData.Customer);
            if (limit) {
                return list.slice(0, limit);
            }
            else {
                return list;
            }
        },
    },
    Mutation: {
        addBooking: function (parent, _a) {
            var _b = _a.input, propertyId = _b.propertyId, customerId = _b.customerId, startTime = _b.startTime, endTime = _b.endTime;
            return {
                id: 'newId',
                propertyId: propertyId,
                customerId: customerId,
                startTime: startTime,
                endTime: endTime,
            };
        },
    },
    Booking: {
        __isTypeOf: function (source, context, info) {
            return Object.prototype.hasOwnProperty.call(source, 'id');
        },
        customer: function (parent) {
            return exports.sampleData.Customer[parent.customerId];
        },
        error: function () {
            throw new Error('Booking.error error');
        },
        errorNonNull: function () {
            throw new Error('Booking.errorNoNull error');
        },
    },
    Customer: {
        bookings: function (parent, _a) {
            var limit = _a.limit;
            var list = values(exports.sampleData.Booking).filter(function (booking) { return booking.customerId === parent.id; });
            if (limit) {
                return list.slice(0, limit);
            }
            else {
                return list;
            }
        },
        vehicle: function (parent) {
            return exports.sampleData.Vehicle[parent.vehicleId];
        },
        error: function () {
            throw new Error('Customer.error error');
        },
    },
    Vehicle: {
        __resolveType: function (parent) {
            if (parent.licensePlate) {
                return 'Car';
            }
            else if (parent.bikeType) {
                return 'Bike';
            }
            else {
                throw new Error('Could not resolve Vehicle type');
            }
        },
    },
    DateTime: DateTime,
};
var subscriptionTypeDefs = "\n  type Notification{\n    text: String\n  }\n\n  type Query{\n    notifications: Notification\n  }\n\n  type Subscription{\n    notifications: Notification\n  }\n";
exports.subscriptionPubSub = new graphql_subscriptions_1.PubSub();
exports.subscriptionPubSubTrigger = 'pubSubTrigger';
var subscriptionResolvers = {
    Query: {
        notifications: function (root) { return ({ text: 'Hello world' }); },
    },
    Subscription: {
        notifications: {
            subscribe: function () {
                return exports.subscriptionPubSub.asyncIterator(exports.subscriptionPubSubTrigger);
            },
        },
    },
};
exports.propertySchema = schemaGenerator_1.makeExecutableSchema({
    typeDefs: propertyAddressTypeDefs,
    resolvers: propertyResolvers,
});
exports.productSchema = schemaGenerator_1.makeExecutableSchema({
    typeDefs: productTypeDefs,
    resolvers: productResolvers,
});
exports.bookingSchema = schemaGenerator_1.makeExecutableSchema({
    typeDefs: bookingAddressTypeDefs,
    resolvers: bookingResolvers,
});
exports.subscriptionSchema = schemaGenerator_1.makeExecutableSchema({
    typeDefs: subscriptionTypeDefs,
    resolvers: subscriptionResolvers,
});
var hasSubscriptionOperation = function (_a) {
    var query = _a.query;
    for (var _i = 0, _b = query.definitions; _i < _b.length; _i++) {
        var definition = _b[_i];
        if (definition.kind === 'OperationDefinition') {
            var operation = definition.operation;
            if (operation === 'subscription') {
                return true;
            }
        }
    }
    return false;
};
// Pretend this schema is remote
function makeSchemaRemoteFromLink(schema) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var link, clientSchema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    link = new apollo_link_1.ApolloLink(function (operation) {
                        return new apollo_link_1.Observable(function (observer) {
                            (function () { return __awaiter(_this, void 0, void 0, function () {
                                var query, operationName, variables, graphqlContext, result, result, next, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            query = operation.query, operationName = operation.operationName, variables = operation.variables;
                                            graphqlContext = operation.getContext().graphqlContext;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 10, , 11]);
                                            if (!!hasSubscriptionOperation(operation)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, graphql_1.graphql(schema, graphql_1.print(query), null, graphqlContext, variables, operationName)];
                                        case 2:
                                            result = _a.sent();
                                            observer.next(result);
                                            observer.complete();
                                            return [3 /*break*/, 9];
                                        case 3: return [4 /*yield*/, graphql_1.subscribe(schema, query, null, graphqlContext, variables, operationName)];
                                        case 4:
                                            result = _a.sent();
                                            if (!(typeof result.next ===
                                                'function')) return [3 /*break*/, 8];
                                            _a.label = 5;
                                        case 5:
                                            if (!true) return [3 /*break*/, 7];
                                            return [4 /*yield*/, result.next()];
                                        case 6:
                                            next = _a.sent();
                                            observer.next(next.value);
                                            if (next.done) {
                                                observer.complete();
                                                return [3 /*break*/, 7];
                                            }
                                            return [3 /*break*/, 5];
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            observer.next(result);
                                            observer.complete();
                                            _a.label = 9;
                                        case 9: return [3 /*break*/, 11];
                                        case 10:
                                            error_1 = _a.sent();
                                            observer.error.bind(observer);
                                            return [3 /*break*/, 11];
                                        case 11: return [2 /*return*/];
                                    }
                                });
                            }); })();
                        });
                    });
                    return [4 /*yield*/, introspectSchema_1.default(link)];
                case 1:
                    clientSchema = _a.sent();
                    return [2 /*return*/, makeRemoteExecutableSchema_1.default({
                            schema: clientSchema,
                            link: link,
                        })];
            }
        });
    });
}
exports.makeSchemaRemoteFromLink = makeSchemaRemoteFromLink;
// ensure fetcher support exists from the 2.0 api
function makeExecutableSchemaFromFetcher(schema) {
    return __awaiter(this, void 0, void 0, function () {
        var fetcher, clientSchema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetcher = function (_a) {
                        var query = _a.query, operationName = _a.operationName, variables = _a.variables, context = _a.context;
                        return graphql_1.graphql(schema, graphql_1.print(query), null, context, variables, operationName);
                    };
                    return [4 /*yield*/, introspectSchema_1.default(fetcher)];
                case 1:
                    clientSchema = _a.sent();
                    return [2 /*return*/, makeRemoteExecutableSchema_1.default({
                            schema: clientSchema,
                            fetcher: fetcher,
                        })];
            }
        });
    });
}
exports.remotePropertySchema = makeSchemaRemoteFromLink(exports.propertySchema);
exports.remoteProductSchema = makeSchemaRemoteFromLink(exports.productSchema);
exports.remoteBookingSchema = makeExecutableSchemaFromFetcher(exports.bookingSchema);
//# sourceMappingURL=testingSchemas.js.map