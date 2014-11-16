"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var Listener = require("./R.EventEmitter.Listener")(R);

  var EventEmitter = (function () {
    var EventEmitter = function EventEmitter() {
      this.listeners = {};
    };

    _classProps(EventEmitter, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      listenTo: {
        writable: true,
        value: function (room, handler) {
          _.dev(function () {
            return room.should.be.a.String && handler.should.be.a.Function;
          });
          var listener = new Listener({ room: room, handler: handler });
          return {
            listener: listener,
            createdRoom: listener.addTo(this.listeners) };
        }
      },
      unlistenFrom: {
        writable: true,
        value: function (listener) {
          _.dev(function () {
            return listener.should.be.an.instanceOf(Listener);
          });
          return {
            listener: listener,
            deletedRoom: listener.removeFrom(this.listeners) };
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          Object.keys(this.listeners).forEach(function (i) {
            return Object.keys(_this.listeners[i]).forEach(function (j) {
              return _this.listeners[i][j].removeFrom(_this.listeners);
            });
          });
          // Nullify references
          this.listeners = null;
        }
      }
    });

    return EventEmitter;
  })();

  _.extend(EventEmitter.prototype, {
    listeners: null });

  _.extend(EventEmitter, { Listener: Listener });

  var MemoryEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);
  var UplinkEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);

  _.extend(EventEmitter, { MemoryEventEmitter: MemoryEventEmitter, UplinkEventEmitter: UplinkEventEmitter });

  return EventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFbkQsWUFBWTtRQUFaLFlBQVksR0FDTCxTQURQLFlBQVksR0FDRjtBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ3JCOztnQkFIRyxZQUFZO0FBS2hCLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsY0FBUTs7ZUFBQSxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDdEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtXQUFBLENBQzdCLENBQUM7QUFDRixjQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0MsaUJBQU87QUFDTCxvQkFBUSxFQUFSLFFBQVE7QUFDUix1QkFBVyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUM1QyxDQUFDO1NBQ0g7O0FBRUQsa0JBQVk7O2VBQUEsVUFBQyxRQUFRLEVBQUU7QUFDckIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN4RCxpQkFBTztBQUNMLG9CQUFRLEVBQVIsUUFBUTtBQUNSLHVCQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQ2pELENBQUM7U0FDSDs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7bUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO3FCQUN2QyxNQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBSyxTQUFTLENBQUM7YUFBQSxDQUNoRDtXQUFBLENBQ0YsQ0FBQzs7QUFFRixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2Qjs7OztXQWxDRyxZQUFZOzs7QUFxQ2xCLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMvQixhQUFTLEVBQUUsSUFBSSxFQUNoQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFckMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0YsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTNGLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsa0JBQWtCLEVBQWxCLGtCQUFrQixFQUFFLGtCQUFrQixFQUFsQixrQkFBa0IsRUFBRSxDQUFDLENBQUM7O0FBRW5FLFNBQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBMaXN0ZW5lciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXInKShSKTtcblxuICBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICBsaXN0ZW5Ubyhyb29tLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IExpc3RlbmVyKHsgcm9vbSwgaGFuZGxlciB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpc3RlbmVyLFxuICAgICAgICBjcmVhdGVkUm9vbTogbGlzdGVuZXIuYWRkVG8odGhpcy5saXN0ZW5lcnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB1bmxpc3RlbkZyb20obGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKExpc3RlbmVyKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgZGVsZXRlZFJvb206IGxpc3RlbmVyLnJlbW92ZUZyb20odGhpcy5saXN0ZW5lcnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goKGkpID0+XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW2ldKS5mb3JFYWNoKChqKSA9PlxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2ldW2pdLnJlbW92ZUZyb20odGhpcy5saXN0ZW5lcnMpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gICAgbGlzdGVuZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIsIHsgTGlzdGVuZXIgfSk7XG5cbiAgY29uc3QgTWVtb3J5RXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXInKShSLCBFdmVudEVtaXR0ZXIpO1xuICBjb25zdCBVcGxpbmtFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL1IuRXZlbnRFbWl0dGVyLk1lbW9yeUV2ZW50RW1pdHRlcicpKFIsIEV2ZW50RW1pdHRlcik7XG5cbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLCB7IE1lbW9yeUV2ZW50RW1pdHRlciwgVXBsaW5rRXZlbnRFbWl0dGVyIH0pO1xuXG4gIHJldHVybiBFdmVudEVtaXR0ZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9