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
      footnotesTitleId = _React$useContext.footnotesTitleId,
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
    className: props.className,
    style: props.style,
    id: idRef,
    href: "#".concat(idNote),
    role: "doc-noteref",
    "aria-describedby": footnotesTitleId,
    "data-a11y-footnotes-ref": true
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
      footnotesTitleId = _React$useContext2.footnotesTitleId;

  var Wrapper = props.Wrapper,
      Title = props.Title,
      List = props.List,
      ListItem = props.ListItem,
      BackLink = props.BackLink;
  if (footnotes.length === 0) return null;
  return /*#__PURE__*/_react["default"].createElement(Wrapper, {
    "data-a11y-footnotes-footer": true,
    role: "doc-endnotes"
  }, /*#__PURE__*/_react["default"].createElement(Title, {
    "data-a11y-footnotes-title": true,
    id: footnotesTitleId
  }), /*#__PURE__*/_react["default"].createElement(List, {
    "data-a11y-footnotes-list": true
  }, footnotes.map(function (_ref) {
    var idNote = _ref.idNote,
        idRef = _ref.idRef,
        description = _ref.description;
    return /*#__PURE__*/_react["default"].createElement(ListItem, {
      id: idNote,
      key: idNote,
      "data-a11y-footnotes-list-item": true
    }, description, ' ', /*#__PURE__*/_react["default"].createElement(BackLink, {
      "data-a11y-footnotes-back-link": true,
      href: '#' + idRef,
      "aria-label": "Back to content",
      role: "doc-backlink"
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
    return /*#__PURE__*/_react["default"].createElement("a", props, "\u21A9");
  }
};

var FootnotesProvider = function FootnotesProvider(_ref2) {
  var children = _ref2.children,
      footnotesTitleId = _ref2.footnotesTitleId;

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

  var getBaseId = _react["default"].useCallback(function (_ref3) {
    var id = _ref3.id,
        children = _ref3.children;
    return id || (0, _utils.getIdFromTree)(children);
  }, []);

  var getFootnoteRefId = _react["default"].useCallback(function (props) {
    return getBaseId(props) + '-ref';
  }, [getBaseId]);

  var getFootnoteId = _react["default"].useCallback(function (props) {
    return getBaseId(props) + '-note';
  }, [getBaseId]);

  return /*#__PURE__*/_react["default"].createElement(FootnotesContext.Provider, {
    value: {
      footnotes: footnotes,
      footnotesTitleId: footnotesTitleId,
      getFootnoteRefId: getFootnoteRefId,
      getFootnoteId: getFootnoteId,
      register: addFootnote
    }
  }, children);
};

exports.FootnotesProvider = FootnotesProvider;
FootnotesProvider.defaultProps = {
  footnotesTitleId: 'footnotes-label'
};
