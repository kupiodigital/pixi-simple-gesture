'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = panable;
function panable(sprite, inertia) {
  function mouseDown(e) {
    start(e.data.originalEvent);
  }

  function touchStart(e) {
    if (e.data.originalEvent.targetTouches && e.data.originalEvent.targetTouches[0]) {
      start(e.data.originalEvent.targetTouches[0]);
    }
  }

  function start(t) {
    if (sprite._pan) {
      if (!sprite._pan.intervalId) {
        return;
      }
      clearInterval(sprite._pan.intervalId);
      sprite.emit('panend');
    }
    sprite._pan = {
      p: {
        x: t.clientX,
        y: t.clientY,
        date: new Date()
      }
    };
    sprite.on('mousemove', mouseMove).on('touchmove', touchMove);
  }

  function mouseMove(e) {
    move(e, e.data.originalEvent);
  }

  function touchMove(e) {
    var t = e.data.originalEvent.targetTouches;
    if (!t || t.length > 1) {
      end(e, t[0]);
      return;
    }
    move(e, t[0]);
  }

  function move(e, t) {
    var now = new Date();
    var interval = now - sprite._pan.p.date;
    if (interval < 12) {
      return;
    }
    var dx = t.clientX - sprite._pan.p.x;
    var dy = t.clientY - sprite._pan.p.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (!sprite._pan.pp) {
      var threshold = t instanceof window.MouseEvent ? 2 : 7;
      if (distance > threshold) {
        sprite.emit('panstart');
      } else {
        return;
      }
    } else {
      var event = {
        deltaX: dx,
        deltaY: dy,
        velocity: distance / interval,
        data: e.data
      };
      sprite.emit('panmove', event);
    }
    sprite._pan.pp = {
      x: sprite._pan.p.x,
      y: sprite._pan.p.y,
      date: sprite._pan.p.date
    };
    sprite._pan.p = {
      x: t.clientX,
      y: t.clientY,
      date: now
    };
  }

  function mouseUp(e) {
    end(e, e.data.originalEvent);
  }

  function touchEnd(e) {
    end(e, e.data.originalEvent.changedTouches[0]);
  }

  function end(e, t) {
    sprite.removeListener('mousemove', mouseMove).removeListener('touchmove', touchMove);
    if (!sprite._pan || !sprite._pan.pp) {
      sprite._pan = null;
      return;
    }
    if (inertia) {
      if (sprite._pan.intervalId) {
        return;
      }
      var interval = new Date() - sprite._pan.pp.date;
      var vx = (t.clientX - sprite._pan.pp.x) / interval;
      var vy = (t.clientY - sprite._pan.pp.y) / interval;
      sprite._pan.intervalId = setInterval(function () {
        if (Math.abs(vx) < 0.04 && Math.abs(vy) < 0.04) {
          clearInterval(sprite._pan.intervalId);
          sprite.emit('panend');
          sprite._pan = null;
          return;
        }
        var touch = {
          clientX: sprite._pan.p.x + vx * 12,
          clientY: sprite._pan.p.y + vy * 12
        };
        move(e, touch);
        vx *= 0.9;
        vy *= 0.9;
      }, 12);
    } else {
      sprite.emit('panend');
      sprite._pan = null;
    }
  }

  sprite.interactive = true;
  sprite.on('mousedown', mouseDown).on('touchstart', touchStart).on('mouseup', mouseUp).on('mouseupoutside', mouseUp).on('touchend', touchEnd).on('touchendoutside', touchEnd);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZXN0dXJlcy9wYW4uanMiXSwibmFtZXMiOlsicGFuYWJsZSIsInNwcml0ZSIsImluZXJ0aWEiLCJtb3VzZURvd24iLCJlIiwic3RhcnQiLCJkYXRhIiwib3JpZ2luYWxFdmVudCIsInRvdWNoU3RhcnQiLCJ0YXJnZXRUb3VjaGVzIiwidCIsIl9wYW4iLCJpbnRlcnZhbElkIiwiY2xlYXJJbnRlcnZhbCIsImVtaXQiLCJwIiwieCIsImNsaWVudFgiLCJ5IiwiY2xpZW50WSIsImRhdGUiLCJEYXRlIiwib24iLCJtb3VzZU1vdmUiLCJ0b3VjaE1vdmUiLCJtb3ZlIiwibGVuZ3RoIiwiZW5kIiwibm93IiwiaW50ZXJ2YWwiLCJkeCIsImR5IiwiZGlzdGFuY2UiLCJNYXRoIiwic3FydCIsInBwIiwidGhyZXNob2xkIiwid2luZG93IiwiTW91c2VFdmVudCIsImV2ZW50IiwiZGVsdGFYIiwiZGVsdGFZIiwidmVsb2NpdHkiLCJtb3VzZVVwIiwidG91Y2hFbmQiLCJjaGFuZ2VkVG91Y2hlcyIsInJlbW92ZUxpc3RlbmVyIiwidngiLCJ2eSIsInNldEludGVydmFsIiwiYWJzIiwidG91Y2giLCJpbnRlcmFjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBQXdCQSxPO0FBQVQsU0FBU0EsT0FBVCxDQUFpQkMsTUFBakIsRUFBeUJDLE9BQXpCLEVBQWtDO0FBQy9DLFdBQVNDLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCO0FBQ3BCQyxVQUFNRCxFQUFFRSxJQUFGLENBQU9DLGFBQWI7QUFDRDs7QUFFRCxXQUFTQyxVQUFULENBQW9CSixDQUFwQixFQUF1QjtBQUNyQixRQUFJQSxFQUFFRSxJQUFGLENBQU9DLGFBQVAsQ0FBcUJFLGFBQXJCLElBQXNDTCxFQUFFRSxJQUFGLENBQU9DLGFBQVAsQ0FBcUJFLGFBQXJCLENBQW1DLENBQW5DLENBQTFDLEVBQWlGO0FBQy9FSixZQUFNRCxFQUFFRSxJQUFGLENBQU9DLGFBQVAsQ0FBcUJFLGFBQXJCLENBQW1D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WixPQUFPVSxJQUFQLENBQVlDLFVBQTFCO0FBQ0FYLGlCQUFPYSxJQUFQLENBQVksUUFBWjtBQUNBYixpQkFBT1UsSUFBUCxHQUFjLElBQWQ7QUFDQTtBQUNEO0FBQ0QsWUFBSXdDLFFBQVE7QUFDVmxDLG1CQUFTaEIsT0FBT1UsSUFBUCxDQUFZSSxDQUFaLENBQWNDLENBQWQsR0FBa0IrQixLQUFLLEVBRHRCO0FBRVY1QixtQkFBU2xCLE9BQU9VLElBQVAsQ0FBWUksQ0FBWixDQUFjRyxDQUFkLEdBQWtCOEIsS0FBSztBQUZ0QixTQUFaO0FBSUF2QixhQUFLckIsQ0FBTCxFQUFRK0MsS0FBUjtBQUNBSixjQUFNLEdBQU47QUFDQUMsY0FBTSxHQUFOO0FBQ0QsT0Fkd0IsRUFjdEIsRUFkc0IsQ0FBekI7QUFlRCxLQXRCRCxNQXNCTztBQUNML0MsYUFBT2EsSUFBUCxDQUFZLFFBQVo7QUFDQWIsYUFBT1UsSUFBUCxHQUFjLElBQWQ7QUFDRDtBQUNGOztBQUVEVixTQUFPbUQsV0FBUCxHQUFxQixJQUFyQjtBQUNBbkQsU0FDR3FCLEVBREgsQ0FDTSxXQUROLEVBQ21CbkIsU0FEbkIsRUFFR21CLEVBRkgsQ0FFTSxZQUZOLEVBRW9CZCxVQUZwQixFQUdHYyxFQUhILENBR00sU0FITixFQUdpQnFCLE9BSGpCLEVBSUdyQixFQUpILENBSU0sZ0JBSk4sRUFJd0JxQixPQUp4QixFQUtHckIsRUFMSCxDQUtNLFVBTE4sRUFLa0JzQixRQUxsQixFQU1HdEIsRUFOSCxDQU1NLGlCQU5OLEVBTXlCc0IsUUFOekI7QUFPRCIsImZpbGUiOiJwYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYW5hYmxlKHNwcml0ZSwgaW5lcnRpYSkge1xyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XHJcbiAgICBzdGFydChlLmRhdGEub3JpZ2luYWxFdmVudClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvdWNoU3RhcnQoZSkge1xyXG4gICAgaWYgKGUuZGF0YS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXMgJiYgZS5kYXRhLm9yaWdpbmFsRXZlbnQudGFyZ2V0VG91Y2hlc1swXSkge1xyXG4gICAgICBzdGFydChlLmRhdGEub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzWzBdKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3RhcnQodCkge1xyXG4gICAgaWYgKHNwcml0ZS5fcGFuKSB7XHJcbiAgICAgIGlmICghc3ByaXRlLl9wYW4uaW50ZXJ2YWxJZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoc3ByaXRlLl9wYW4uaW50ZXJ2YWxJZClcclxuICAgICAgc3ByaXRlLmVtaXQoJ3BhbmVuZCcpXHJcbiAgICB9XHJcbiAgICBzcHJpdGUuX3BhbiA9IHtcclxuICAgICAgcDoge1xyXG4gICAgICAgIHg6IHQuY2xpZW50WCxcclxuICAgICAgICB5OiB0LmNsaWVudFksXHJcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzcHJpdGVcclxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpXHJcbiAgICAgIC5vbigndG91Y2htb3ZlJywgdG91Y2hNb3ZlKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VNb3ZlKGUpIHtcclxuICAgIG1vdmUoZSwgZS5kYXRhLm9yaWdpbmFsRXZlbnQpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b3VjaE1vdmUoZSkge1xyXG4gICAgbGV0IHQgPSBlLmRhdGEub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzXHJcbiAgICBpZiAoIXQgfHwgdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGVuZChlLCB0WzBdKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIG1vdmUoZSwgdFswXSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdmUoZSwgdCkge1xyXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKClcclxuICAgIGxldCBpbnRlcnZhbCA9IG5vdyAtIHNwcml0ZS5fcGFuLnAuZGF0ZVxyXG4gICAgaWYgKGludGVydmFsIDwgMTIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBsZXQgZHggPSB0LmNsaWVudFggLSBzcHJpdGUuX3Bhbi5wLnhcclxuICAgIGxldCBkeSA9IHQuY2xpZW50WSAtIHNwcml0ZS5fcGFuLnAueVxyXG4gICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxyXG4gICAgaWYgKCFzcHJpdGUuX3Bhbi5wcCkge1xyXG4gICAgICBsZXQgdGhyZXNob2xkID0gKHQgaW5zdGFuY2VvZiB3aW5kb3cuTW91c2VFdmVudCkgPyAyIDogN1xyXG4gICAgICBpZiAoZGlzdGFuY2UgPiB0aHJlc2hvbGQpIHtcclxuICAgICAgICBzcHJpdGUuZW1pdCgncGFuc3RhcnQnKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgZXZlbnQgPSB7XHJcbiAgICAgICAgZGVsdGFYOiBkeCxcclxuICAgICAgICBkZWx0YVk6IGR5LFxyXG4gICAgICAgIHZlbG9jaXR5OiBkaXN0YW5jZSAvIGludGVydmFsLFxyXG4gICAgICAgIGRhdGE6IGUuZGF0YVxyXG4gICAgICB9XHJcbiAgICAgIHNwcml0ZS5lbWl0KCdwYW5tb3ZlJywgZXZlbnQpXHJcbiAgICB9XHJcbiAgICBzcHJpdGUuX3Bhbi5wcCA9IHtcclxuICAgICAgeDogc3ByaXRlLl9wYW4ucC54LFxyXG4gICAgICB5OiBzcHJpdGUuX3Bhbi5wLnksXHJcbiAgICAgIGRhdGU6IHNwcml0ZS5fcGFuLnAuZGF0ZVxyXG4gICAgfVxyXG4gICAgc3ByaXRlLl9wYW4ucCA9IHtcclxuICAgICAgeDogdC5jbGllbnRYLFxyXG4gICAgICB5OiB0LmNsaWVudFksXHJcbiAgICAgIGRhdGU6IG5vd1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VVcChlKSB7XHJcbiAgICBlbmQoZSwgZS5kYXRhLm9yaWdpbmFsRXZlbnQpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b3VjaEVuZChlKSB7XHJcbiAgICBlbmQoZSwgZS5kYXRhLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbmQoZSwgdCkge1xyXG4gICAgc3ByaXRlXHJcbiAgICAgIC5yZW1vdmVMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlKVxyXG4gICAgICAucmVtb3ZlTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNoTW92ZSlcclxuICAgIGlmICghc3ByaXRlLl9wYW4gfHwgIXNwcml0ZS5fcGFuLnBwKSB7XHJcbiAgICAgIHNwcml0ZS5fcGFuID0gbnVsbFxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmIChpbmVydGlhKSB7XHJcbiAgICAgIGlmIChzcHJpdGUuX3Bhbi5pbnRlcnZhbElkKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgbGV0IGludGVydmFsID0gbmV3IERhdGUoKSAtIHNwcml0ZS5fcGFuLnBwLmRhdGVcclxuICAgICAgbGV0IHZ4ID0gKHQuY2xpZW50WCAtIHNwcml0ZS5fcGFuLnBwLngpIC8gaW50ZXJ2YWxcclxuICAgICAgbGV0IHZ5ID0gKHQuY2xpZW50WSAtIHNwcml0ZS5fcGFuLnBwLnkpIC8gaW50ZXJ2YWxcclxuICAgICAgc3ByaXRlLl9wYW4uaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAoTWF0aC5hYnModngpIDwgMC4wNCAmJiBNYXRoLmFicyh2eSkgPCAwLjA0KSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHNwcml0ZS5fcGFuLmludGVydmFsSWQpXHJcbiAgICAgICAgICBzcHJpdGUuZW1pdCgncGFuZW5kJylcclxuICAgICAgICAgIHNwcml0ZS5fcGFuID0gbnVsbFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0b3VjaCA9IHtcclxuICAgICAgICAgIGNsaWVudFg6IHNwcml0ZS5fcGFuLnAueCArIHZ4ICogMTIsXHJcbiAgICAgICAgICBjbGllbnRZOiBzcHJpdGUuX3Bhbi5wLnkgKyB2eSAqIDEyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1vdmUoZSwgdG91Y2gpXHJcbiAgICAgICAgdnggKj0gMC45XHJcbiAgICAgICAgdnkgKj0gMC45XHJcbiAgICAgIH0sIDEyKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3ByaXRlLmVtaXQoJ3BhbmVuZCcpXHJcbiAgICAgIHNwcml0ZS5fcGFuID0gbnVsbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3ByaXRlLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gIHNwcml0ZVxyXG4gICAgLm9uKCdtb3VzZWRvd24nLCBtb3VzZURvd24pXHJcbiAgICAub24oJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0KVxyXG4gICAgLm9uKCdtb3VzZXVwJywgbW91c2VVcClcclxuICAgIC5vbignbW91c2V1cG91dHNpZGUnLCBtb3VzZVVwKVxyXG4gICAgLm9uKCd0b3VjaGVuZCcsIHRvdWNoRW5kKVxyXG4gICAgLm9uKCd0b3VjaGVuZG91dHNpZGUnLCB0b3VjaEVuZClcclxufVxyXG4iXX0=