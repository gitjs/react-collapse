'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

var _reactMotion = require('react-motion');

var _reactHeight = require('react-height');

var _reactHeight2 = _interopRequireDefault(_reactHeight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var stringHeight = function stringHeight(height) {
  return Math.max(0, parseFloat(height)).toFixed(1);
};

var Collapse = _react2.default.createClass({
  displayName: 'Collapse',

  propTypes: {
    isOpened: _react2.default.PropTypes.bool.isRequired,
    children: _react2.default.PropTypes.node.isRequired,
    fixedHeight: _react2.default.PropTypes.number,
    style: _react2.default.PropTypes.object, // eslint-disable-line react/forbid-prop-types
    springConfig: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.number),
    keepCollapsedContent: _react2.default.PropTypes.bool,
    onHeightReady: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return { fixedHeight: -1, style: {}, keepCollapsedContent: false };
  },
  getInitialState: function getInitialState() {
    return { height: -1, isOpenedChanged: false };
  },
  componentWillMount: function componentWillMount() {
    this.height = stringHeight(0);
    this.renderStatic = true;
  },
  componentWillReceiveProps: function componentWillReceiveProps(_ref) {
    var _this = this;

    var isOpened = _ref.isOpened;

    var isOpenedChanged = isOpened !== this.props.isOpened;
    this.setState({ isOpenedChanged: isOpenedChanged }, function () {
      if (_this.props.onHeightReady && isOpenedChanged) {
        _this.props.onHeightReady(isOpened ? _this.state.height : 0);
      }
    });
  },


  shouldComponentUpdate: _ReactComponentWithPureRenderMixin.shouldComponentUpdate,

  onHeightReady: function onHeightReady(height) {
    if (this.renderStatic && this.props.isOpened) {
      this.height = stringHeight(height);
    }
    this.setState({ height: height });
    if (this.props.onHeightReady && !this.state.isOpenedChanged) {
      this.props.onHeightReady(this.props.isOpened ? height : 0);
    }
  },
  getMotionHeight: function getMotionHeight(height) {
    var _props = this.props;
    var isOpened = _props.isOpened;
    var springConfig = _props.springConfig;
    var isOpenedChanged = this.state.isOpenedChanged;


    var newHeight = isOpened ? Math.max(0, parseFloat(height)).toFixed(1) : stringHeight(0);

    // No need to animate if content is closed and it was closed previously
    // Also no need to animate if height did not change
    var skipAnimation = !isOpenedChanged && !isOpened || this.height === newHeight;

    var springHeight = (0, _reactMotion.spring)(isOpened ? Math.max(0, height) : 0, springConfig);
    var instantHeight = isOpened ? Math.max(0, height) : 0;

    return skipAnimation ? instantHeight : springHeight;
  },
  renderFixed: function renderFixed() {
    var _this2 = this;

    var _props2 = this.props;
    var isOpened = _props2.isOpened;
    var style = _props2.style;
    var children = _props2.children;
    var fixedHeight = _props2.fixedHeight;
    var _ = _props2.springConfig;
    var keepCollapsedContent = _props2.keepCollapsedContent;

    var props = _objectWithoutProperties(_props2, ['isOpened', 'style', 'children', 'fixedHeight', 'springConfig', 'keepCollapsedContent']);

    if (this.renderStatic) {
      this.renderStatic = false;
      var newStyle = { overflow: 'hidden', height: isOpened ? fixedHeight : 0 };

      if (!keepCollapsedContent && !isOpened) {
        return null;
      }
      this.height = stringHeight(fixedHeight);
      return _react2.default.createElement(
        'div',
        _extends({ style: _extends({}, newStyle, style) }, props),
        children
      );
    }

    return _react2.default.createElement(
      _reactMotion.Motion,
      {
        defaultStyle: { height: isOpened ? 0 : fixedHeight },
        style: { height: this.getMotionHeight(fixedHeight) } },
      function (_ref2) {
        var height = _ref2.height;

        _this2.height = stringHeight(height);

        // TODO: this should be done using onEnd from ReactMotion, which is not yet implemented
        // See https://github.com/chenglou/react-motion/issues/235
        if (!keepCollapsedContent && !isOpened && _this2.height === stringHeight(0)) {
          return null;
        }

        var newStyle = { overflow: 'hidden', height: height };

        return _react2.default.createElement(
          'div',
          _extends({ style: _extends({}, newStyle, style) }, props),
          children
        );
      }
    );
  },
  render: function render() {
    var _this3 = this;

    var _props3 = this.props;
    var isOpened = _props3.isOpened;
    var style = _props3.style;
    var children = _props3.children;
    var fixedHeight = _props3.fixedHeight;
    var _ = _props3.springConfig;
    var keepCollapsedContent = _props3.keepCollapsedContent;

    var props = _objectWithoutProperties(_props3, ['isOpened', 'style', 'children', 'fixedHeight', 'springConfig', 'keepCollapsedContent']);

    if (fixedHeight > -1) {
      return this.renderFixed();
    }

    var renderStatic = this.renderStatic;
    var height = this.state.height;

    var currentStringHeight = parseFloat(height).toFixed(1);

    if (height > -1 && renderStatic) {
      this.renderStatic = false;
    }

    // Cache Content so it is not re-rendered on each animation step
    var content = _react2.default.createElement(
      _reactHeight2.default,
      { onHeightReady: this.onHeightReady },
      children
    );

    if (renderStatic) {
      var newStyle = { overflow: 'hidden', height: isOpened ? 'auto' : 0 };

      if (!isOpened && height > -1) {
        if (!keepCollapsedContent) {
          return null;
        }
        return _react2.default.createElement(
          'div',
          _extends({ style: _extends({ height: 0, overflow: 'hidden' }, style) }, props),
          content
        );
      }

      return _react2.default.createElement(
        'div',
        _extends({ style: _extends({}, newStyle, style) }, props),
        content
      );
    }

    return _react2.default.createElement(
      _reactMotion.Motion,
      {
        defaultStyle: { height: isOpened ? 0 : Math.max(0, height) },
        style: { height: this.getMotionHeight(height) } },
      function (st) {
        _this3.height = stringHeight(st.height);

        // TODO: this should be done using onEnd from ReactMotion, which is not yet implemented
        // See https://github.com/chenglou/react-motion/issues/235
        if (!isOpened && _this3.height === '0.0') {
          if (!keepCollapsedContent) {
            return null;
          }
          return _react2.default.createElement(
            'div',
            _extends({ style: _extends({ height: 0, overflow: 'hidden' }, style) }, props),
            content
          );
        }

        var newStyle = isOpened && _this3.height === currentStringHeight ? { height: 'auto' } : {
          height: st.height, overflow: 'hidden'
        };

        return _react2.default.createElement(
          'div',
          _extends({ style: _extends({}, newStyle, style) }, props),
          content
        );
      }
    );
  }
});

exports.default = Collapse;
//# sourceMappingURL=Collapse.js.map