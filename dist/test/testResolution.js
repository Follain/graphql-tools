"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("..");
var graphql_1 = require("graphql");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var iterall_1 = require("iterall");
describe('Resolve', function () {
    describe('addSchemaLevelResolveFunction', function () {
        var pubsub = new graphql_subscriptions_1.PubSub();
        var typeDefs = "\n      type RootQuery {\n        printRoot: String!\n        printRootAgain: String!\n      }\n\n      type RootMutation {\n        printRoot: String!\n      }\n\n      type RootSubscription {\n        printRoot: String!\n      }\n\n      schema {\n        query: RootQuery\n        mutation: RootMutation\n        subscription: RootSubscription\n      }\n    ";
        var printRoot = function (root) { return root.toString(); };
        var resolvers = {
            RootQuery: {
                printRoot: printRoot,
                printRootAgain: printRoot,
            },
            RootMutation: {
                printRoot: printRoot,
            },
            RootSubscription: {
                printRoot: {
                    subscribe: function () { return pubsub.asyncIterator('printRootChannel'); },
                },
            },
        };
        var schema = __1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
        var schemaLevelResolveFunctionCalls = 0;
        __1.addSchemaLevelResolveFunction(schema, function (root) {
            schemaLevelResolveFunctionCalls += 1;
            return root;
        });
        it('should run the schema level resolver once in a same query', function () {
            schemaLevelResolveFunctionCalls = 0;
            var root = 'queryRoot';
            return graphql_1.graphql(schema, "\n          query TestOnce {\n            printRoot\n            printRootAgain\n          }\n        ", root).then(function (_a) {
                var data = _a.data;
                chai_1.assert.deepEqual(data, {
                    printRoot: root,
                    printRootAgain: root,
                });
                chai_1.assert.equal(schemaLevelResolveFunctionCalls, 1);
            });
        });
        it('should isolate roots from the different operation types', function (done) {
            schemaLevelResolveFunctionCalls = 0;
            var queryRoot = 'queryRoot';
            var mutationRoot = 'mutationRoot';
            var subscriptionRoot = 'subscriptionRoot';
            var subscriptionRoot2 = 'subscriptionRoot2';
            var subsCbkCalls = 0;
            var firstSubsTriggered = new Promise(function (resolveFirst) {
                graphql_1.subscribe(schema, graphql_1.parse("\n            subscription TestSubscription {\n              printRoot\n            }\n          "))
                    .then(function (results) {
                    iterall_1.forAwaitEach(results, function (result) {
                        if (result.errors) {
                            return done(new Error("Unexpected errors in GraphQL result: " + result.errors));
                        }
                        var subsData = result.data;
                        subsCbkCalls++;
                        try {
                            if (subsCbkCalls === 1) {
                                chai_1.assert.equal(schemaLevelResolveFunctionCalls, 1);
                                chai_1.assert.deepEqual(subsData, { printRoot: subscriptionRoot });
                                return resolveFirst();
                            }
                            else if (subsCbkCalls === 2) {
                                chai_1.assert.equal(schemaLevelResolveFunctionCalls, 4);
                                chai_1.assert.deepEqual(subsData, {
                                    printRoot: subscriptionRoot2,
                                });
                                return done();
                            }
                        }
                        catch (e) {
                            return done(e);
                        }
                        done(new Error('Too many subscription fired'));
                    }).catch(done);
                })
                    .catch(done);
            });
            pubsub.publish('printRootChannel', { printRoot: subscriptionRoot });
            firstSubsTriggered
                .then(function () {
                return graphql_1.graphql(schema, "\n              query TestQuery {\n                printRoot\n              }\n            ", queryRoot);
            })
                .then(function (_a) {
                var data = _a.data;
                chai_1.assert.equal(schemaLevelResolveFunctionCalls, 2);
                chai_1.assert.deepEqual(data, { printRoot: queryRoot });
                return graphql_1.graphql(schema, "\n              mutation TestMutation {\n                printRoot\n              }\n            ", mutationRoot);
            })
                .then(function (_a) {
                var mutationData = _a.data;
                chai_1.assert.equal(schemaLevelResolveFunctionCalls, 3);
                chai_1.assert.deepEqual(mutationData, { printRoot: mutationRoot });
                pubsub.publish('printRootChannel', { printRoot: subscriptionRoot2 });
            })
                .catch(done);
        });
    });
});
//# sourceMappingURL=testResolution.js.map