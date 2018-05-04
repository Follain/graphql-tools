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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var errors_1 = require("../stitching/errors");
require("mocha");
var ErrorWithResult = /** @class */ (function (_super) {
    __extends(ErrorWithResult, _super);
    function ErrorWithResult(message, result) {
        var _this = _super.call(this, message) || this;
        _this.result = result;
        return _this;
    }
    return ErrorWithResult;
}(Error));
var mockErrors = (_a = {
        responseKey: ''
    },
    _a[errors_1.ErrorSymbol] = [
        {
            message: 'Test error without path',
        },
    ],
    _a);
describe('Errors', function () {
    describe('getErrorsFromParent', function () {
        it('should return OWN error kind if path is not defined', function () {
            chai_1.assert.deepEqual(errors_1.getErrorsFromParent(mockErrors, 'responseKey'), { kind: 'OWN', error: mockErrors[errors_1.ErrorSymbol][0] });
        });
    });
    describe('checkResultAndHandleErrors', function () {
        it('persists single error with a result', function (done) {
            var result = {
                errors: [new ErrorWithResult('Test error', 'result')]
            };
            try {
                errors_1.checkResultAndHandleErrors(result, {}, 'responseKey');
            }
            catch (e) {
                chai_1.assert.equal(e.message, 'Test error');
                chai_1.assert.isUndefined(e.originalError.errors);
                done();
            }
        });
        it('persists original errors without a result', function (done) {
            var result = {
                errors: [new Error('Test error')]
            };
            try {
                errors_1.checkResultAndHandleErrors(result, {}, 'responseKey');
            }
            catch (e) {
                chai_1.assert.equal(e.message, 'Test error');
                chai_1.assert.isNotEmpty(e.originalError);
                chai_1.assert.isNotEmpty(e.originalError.errors);
                chai_1.assert.lengthOf(e.originalError.errors, result.errors.length);
                result.errors.forEach(function (error, i) {
                    chai_1.assert.deepEqual(e.originalError.errors[i], error);
                });
                done();
            }
        });
        it('combines errors and perists the original errors', function (done) {
            var result = {
                errors: [
                    new Error('Error1'),
                    new Error('Error2')
                ]
            };
            try {
                errors_1.checkResultAndHandleErrors(result, {}, 'responseKey');
            }
            catch (e) {
                chai_1.assert.equal(e.message, 'Error1\nError2');
                chai_1.assert.isNotEmpty(e.originalError);
                chai_1.assert.isNotEmpty(e.originalError.errors);
                chai_1.assert.lengthOf(e.originalError.errors, result.errors.length);
                result.errors.forEach(function (error, i) {
                    chai_1.assert.deepEqual(e.originalError.errors[i], error);
                });
                done();
            }
        });
    });
});
var _a;
//# sourceMappingURL=testErrors.js.map