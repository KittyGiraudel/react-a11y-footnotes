"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FootnotesProvider = exports.Footnotes = exports.FootnoteRef = void 0;
exports.getIdFromTree = getIdFromTree;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var FootnotesContext = /*#__PURE__*/_react["default"].createContext({});
var FootnoteRef = exports.FootnoteRef = function FootnoteRef(props) {
  var description = props.description;
  var _React$useContext = _react["default"].useContext(FootnotesContext),
    footnotes = _React$useContext.footnotes,
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

  // It is not possible to update the React state on the server, still the
  // footnote references need to be registered so the footnotes can be rendered.
  // In that case, we mutate the state directly so the footnotes work with SSR.
  if (!footnotes.has(footnote.idRef)) {
    footnotes.set(footnote.idRef, footnote);
  }

  // Once the application mounts, the footnotes state has been emptied and we
  // can properly register the current footnote in it, and unregister it if it
  // was to unmount.
  _react["default"].useEffect(function () {
    var unregister = register(footnote);
    return function () {
      return unregister();
    };
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
FootnoteRef.propTypes = {
  description: _propTypes["default"].node.isRequired,
  children: _propTypes["default"].node.isRequired,
  id: _propTypes["default"].string
};
var Footnotes = exports.Footnotes = function Footnotes(_ref) {
  var _ref$Wrapper = _ref.Wrapper,
    Wrapper = _ref$Wrapper === void 0 ? 'footer' : _ref$Wrapper,
    _ref$Title = _ref.Title,
    Title = _ref$Title === void 0 ? function (props) {
      return /*#__PURE__*/_react["default"].createElement("h2", props, "Footnotes");
    } : _ref$Title,
    _ref$List = _ref.List,
    List = _ref$List === void 0 ? 'ol' : _ref$List,
    _ref$ListItem = _ref.ListItem,
    ListItem = _ref$ListItem === void 0 ? 'li' : _ref$ListItem,
    _ref$BackLink = _ref.BackLink,
    BackLink = _ref$BackLink === void 0 ? function (props) {
      return /*#__PURE__*/_react["default"].createElement("a", props, "\u21A9");
    } : _ref$BackLink;
  var _React$useContext2 = _react["default"].useContext(FootnotesContext),
    footnotes = _React$useContext2.footnotes,
    footnotesTitleId = _React$useContext2.footnotesTitleId;
  if (footnotes.size === 0) return null;
  var references = Array.from(footnotes.values());
  return /*#__PURE__*/_react["default"].createElement(Wrapper, {
    "data-a11y-footnotes-footer": true,
    role: "doc-endnotes"
  }, /*#__PURE__*/_react["default"].createElement(Title, {
    "data-a11y-footnotes-title": true,
    id: footnotesTitleId
  }), /*#__PURE__*/_react["default"].createElement(List, {
    "data-a11y-footnotes-list": true
  }, references.map(function (_ref2, index) {
    var idNote = _ref2.idNote,
      idRef = _ref2.idRef,
      description = _ref2.description;
    return /*#__PURE__*/_react["default"].createElement(ListItem, {
      id: idNote,
      key: idNote,
      "data-a11y-footnotes-list-item": true
    }, description, "\xA0", /*#__PURE__*/_react["default"].createElement(BackLink, {
      "data-a11y-footnotes-back-link": true,
      href: '#' + idRef,
      "aria-label": "Back to reference ".concat(index + 1),
      role: "doc-backlink"
    }));
  })));
};
var FootnotesProvider = exports.FootnotesProvider = function FootnotesProvider(_ref3) {
  var children = _ref3.children,
    _ref3$footnotesTitleI = _ref3.footnotesTitleId,
    footnotesTitleId = _ref3$footnotesTitleI === void 0 ? 'footnotes-label' : _ref3$footnotesTitleI;
  var _React$useState = _react["default"].useState(new Map()),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    footnotes = _React$useState2[0],
    setFootnotes = _React$useState2[1];
  var getBaseId = _react["default"].useCallback(function (_ref4) {
    var id = _ref4.id,
      children = _ref4.children;
    return id || getIdFromTree(children);
  }, []);
  var getFootnoteRefId = _react["default"].useCallback(function (props) {
    return getBaseId(props) + '-ref';
  }, [getBaseId]);
  var getFootnoteId = _react["default"].useCallback(function (props) {
    return getBaseId(props) + '-note';
  }, [getBaseId]);

  // When JavaScript kicks in and the application mounts, reset the footnotes
  // store which was mutated by every reference.
  _react["default"].useEffect(function () {
    return setFootnotes(new Map());
  }, []);
  var register = _react["default"].useCallback(function (footnote) {
    setFootnotes(function (footnotes) {
      var clone = new Map(footnotes);
      if (!clone.has(footnote.idRef)) clone.set(footnote.idRef, footnote);
      return clone;
    });

    // Return a function which can be used to unregister the footnote. This
    // makes it convenient to register a footnote reference on mount, and
    // unregister it on unmount.
    return function () {
      setFootnotes(function (footnotes) {
        var clone = new Map(footnotes);
        clone["delete"](footnote.idRef);
        return clone;
      });
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement(FootnotesContext.Provider, {
    value: {
      footnotes: footnotes,
      footnotesTitleId: footnotesTitleId,
      getFootnoteRefId: getFootnoteRefId,
      getFootnoteId: getFootnoteId,
      register: register
    }
  }, children);
};
function getTextFromTree(tree) {
  var text = '';
  if (typeof tree === 'string') {
    text += tree;
  } else if (Array.isArray(tree)) {
    text += tree.map(getTextFromTree).join('');
  } else if (tree.props.children) {
    text += getTextFromTree(tree.props.children);
  }
  return text;
}
function getIdFromTree(tree) {
  return getTextFromTree(tree).toLowerCase()
  // Remove any character that is not a letter, a number, an hyphen or an
  // underscore, regardless of casing
  .replace(/[^a-z0-9-_\s]/g, '')
  // Replace all spaces with hyphens
  .replace(/\s+/g, '-');
}
