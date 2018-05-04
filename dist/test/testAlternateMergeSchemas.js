"use strict";
/* tslint:disable:no-unused-expression */
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
var transforms_1 = require("../transforms");
var testingSchemas_1 = require("./testingSchemas");
var linkSchema = "\n  \"\"\"\n  A new type linking the Property type.\n  \"\"\"\n  type LinkType {\n    test: String\n    \"\"\"\n    The property.\n    \"\"\"\n    property: Properties_Property\n  }\n\n  interface Node {\n    id: ID!\n  }\n\n  extend type Bookings_Booking implements Node {\n    \"\"\"\n    The property of the booking.\n    \"\"\"\n    property: Properties_Property\n  }\n\n  extend type Properties_Property implements Node {\n    \"\"\"\n    A list of bookings.\n    \"\"\"\n    bookings(\n      \"\"\"\n      The maximum number of bookings to retrieve.\n      \"\"\"\n      limit: Int\n    ): [Bookings_Booking]\n  }\n\n  extend type Query {\n    linkTest: LinkType\n    node(id: ID!): Node\n    nodes: [Node]\n  }\n\n  extend type Bookings_Customer implements Node\n";
describe('merge schemas through transforms', function () {
    var mergedSchema;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var transformedPropertySchema, transformedBookingSchema;
        return __generator(this, function (_a) {
            transformedPropertySchema = transforms_1.transformSchema(testingSchemas_1.propertySchema, [
                new transforms_1.FilterRootFields(function (operation, rootField) {
                    return 'Query.properties' === operation + "." + rootField;
                }),
                new transforms_1.RenameTypes(function (name) { return "Properties_" + name; }),
                new transforms_1.RenameRootFields(function (name) { return "Properties_" + name; }),
            ]);
            transformedBookingSchema = transforms_1.transformSchema(testingSchemas_1.bookingSchema, [
                new transforms_1.FilterRootFields(function (operation, rootField) {
                    return 'Query.bookings' === operation + "." + rootField;
                }),
                new transforms_1.RenameTypes(function (name) { return "Bookings_" + name; }),
                new transforms_1.RenameRootFields(function (operation, name) { return "Bookings_" + name; }),
            ]);
            mergedSchema = mergeSchemas_1.default({
                schemas: [
                    transformedPropertySchema,
                    transformedBookingSchema,
                    linkSchema,
                ],
                resolvers: {
                    Query: {
                        // delegating directly, no subschemas or mergeInfo
                        node: function (parent, args, context, info) {
                            if (args.id.startsWith('p')) {
                                return info.mergeInfo.delegateToSchema({
                                    schema: testingSchemas_1.propertySchema,
                                    operation: 'query',
                                    fieldName: 'propertyById',
                                    args: args,
                                    context: context,
                                    info: info,
                                    transforms: transformedPropertySchema.transforms,
                                });
                            }
                            else if (args.id.startsWith('b')) {
                                return info.mergeInfo.delegateToSchema({
                                    schema: testingSchemas_1.bookingSchema,
                                    operation: 'query',
                                    fieldName: 'bookingById',
                                    args: args,
                                    context: context,
                                    info: info,
                                    transforms: transformedBookingSchema.transforms,
                                });
                            }
                            else if (args.id.startsWith('c')) {
                                return info.mergeInfo.delegateToSchema({
                                    schema: testingSchemas_1.bookingSchema,
                                    operation: 'query',
                                    fieldName: 'customerById',
                                    args: args,
                                    context: context,
                                    info: info,
                                    transforms: transformedBookingSchema.transforms,
                                });
                            }
                            else {
                                throw new Error('invalid id');
                            }
                        },
                    },
                    Properties_Property: {
                        bookings: {
                            fragment: 'fragment PropertyFragment on Property { id }',
                            resolve: function (parent, args, context, info) {
                                return info.mergeInfo.delegateToSchema({
                                    schema: testingSchemas_1.bookingSchema,
                                    operation: 'query',
                                    fieldName: 'bookingsByPropertyId',
                                    args: {
                                        propertyId: parent.id,
                                        limit: args.limit ? args.limit : null,
                                    },
                                    context: context,
                                    info: info,
                                    transforms: transformedBookingSchema.transforms,
                                });
                            },
                        },
                    },
                    Bookings_Booking: {
                        property: {
                            fragment: 'fragment BookingFragment on Booking { propertyId }',
                            resolve: function (parent, args, context, info) {
                                return info.mergeInfo.delegateToSchema({
                                    schema: testingSchemas_1.propertySchema,
                                    operation: 'query',
                                    fieldName: 'propertyById',
                                    args: {
                                        id: parent.propertyId,
                                    },
                                    context: context,
                                    info: info,
                                    transforms: transformedPropertySchema.transforms,
                                });
                            },
                        },
                    },
                },
            });
            return [2 /*return*/];
        });
    }); });
    // FIXME fragemnt replacements
    it('node should work', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, graphql_1.graphql(mergedSchema, "\n        query($pid: ID!, $bid: ID!) {\n          property: node(id: $pid) {\n            __typename\n            ... on Properties_Property {\n              name\n              bookings {\n                startTime\n                endTime\n              }\n            }\n          }\n          booking: node(id: $bid) {\n            __typename\n            ... on Bookings_Booking {\n              startTime\n              endTime\n              property {\n                id\n                name\n              }\n            }\n          }\n        }\n      ", {}, {}, {
                        pid: 'p1',
                        bid: 'b1',
                    })];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.deep.equal({
                        data: {
                            booking: {
                                __typename: 'Bookings_Booking',
                                endTime: '2016-06-03',
                                property: {
                                    id: 'p1',
                                    name: 'Super great hotel',
                                },
                                startTime: '2016-05-04',
                            },
                            property: {
                                __typename: 'Properties_Property',
                                bookings: [
                                    {
                                        endTime: '2016-06-03',
                                        startTime: '2016-05-04',
                                    },
                                    {
                                        endTime: '2016-07-03',
                                        startTime: '2016-06-04',
                                    },
                                    {
                                        endTime: '2016-09-03',
                                        startTime: '2016-08-04',
                                    },
                                ],
                                name: 'Super great hotel',
                            },
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=testAlternateMergeSchemas.js.map