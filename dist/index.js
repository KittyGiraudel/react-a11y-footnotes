"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FootnotesProvider = exports.Footnotes = exports.FootnoteRef = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var FootnotesContext = /*#__PURE__*/_react["default"].createContext({});

var FootnoteRef = function FootnoteRef(props) {
  var description = props.description;

  var _React$useContext = _react["default"].useContext(FootnotesContext),
      footnotesLabelId = _React$useContext.footnotesLabelId,
      getFootnoteRefId = _React$useContext.getFootnoteRefId,
      getFootnoteId = _React$useContext.getFootnoteId,
      register = _React$useContext.register;

  var idRef = _react["default"].useMemo(function () {
    return getFootnoteRefId(props);
  }, [getFootnoteRefId, props]);

  var idNote = _react["default"].useMemo(function () {
    return getFootnoteId(props);
  }, [getFootnoteId, props]);

  var footnote = _react["default"].useMemo(function () {
    return {
      idRef: idRef,
      idNote: idNote,
      description: description
    };
  }, [idRef, idNote, description]);

  _react["default"].useEffect(function () {
    return register(footnote);
  }, [register, footnote]);

  return /*#__PURE__*/_react["default"].createElement("a", {
    id: idRef,
    href: "#".concat(idNote),
    className: props.className,
    "aria-describedby": footnotesLabelId
  }, props.children);
};

exports.FootnoteRef = FootnoteRef;
FootnoteRef.propTypes = {
  description: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].node.isRequired,
  id: _propTypes["default"].string
};

var Footnotes = function Footnotes(props) {
  var _React$useContext2 = _react["default"].useContext(FootnotesContext),
      footnotes = _React$useContext2.footnotes,
      footnotesLabelId = _React$useContext2.footnotesLabelId;

  if (footnotes.length === 0) return null;
  return /*#__PURE__*/_react["default"].createElement(props.Wrapper, null, /*#__PURE__*/_react["default"].createElement(props.Title, {
    id: footnotesLabelId
  }), /*#__PURE__*/_react["default"].createElement(props.List, null, footnotes.map(function (_ref) {
    var idNote = _ref.idNote,
        idRef = _ref.idRef,
        description = _ref.description;
    return /*#__PURE__*/_react["default"].createElement(props.ListItem, {
      id: idNote,
      key: idNote
    }, description, " ", /*#__PURE__*/_react["default"].createElement(props.BackLink, {
      id: idRef
    }));
  })));
};

exports.Footnotes = Footnotes;
Footnotes.defaultProps = {
  Wrapper: 'footer',
  Title: function Title(props) {
    return /*#__PURE__*/_react["default"].createElement("h2", props, "Footnotes");
  },
  List: 'ol',
  ListItem: 'li',
  BackLink: function BackLink(props) {
    return /*#__PURE__*/_react["default"].createElement("a", {
      href: '#' + props.id,
      "aria-label": "Back to content"
    }, "\u21A9");
  }
};

var FootnotesProvider = function FootnotesProvider(props) {
  var _React$useState = _react["default"].useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      footnotes = _React$useState2[0],
      setFootnotes = _React$useState2[1];

  var addFootnote = _react["default"].useCallback(function (footnote) {
    setFootnotes(function (footnotes) {
      return footnotes.filter(function (f) {
        return f.idRef !== footnote.idRef;
      }).concat(footnote);
    });
  }, []);

  var getFootnoteRefId = _react["default"].useCallback(function (props) {
    return (props.id || (0, _utils.getIdFromTree)(props.children)) + '-ref';
  }, []);

  var getFootnoteId = _react["default"].useCallback(function (props) {
    return (props.id || (0, _utils.getIdFromTree)(props.children)) + '-note';
  }, []);

  return /*#__PURE__*/_react["default"].createElement(FootnotesContext.Provider, {
    value: {
      footnotes: footnotes,
      footnotesLabelId: props.footnotesLabelId || 'footnotes-label',
      getFootnoteRefId: getFootnoteRefId,
      getFootnoteId: getFootnoteId,
      register: addFootnote
    }
  }, props.children);
};

exports.FootnotesProvider = FootnotesProvider;
