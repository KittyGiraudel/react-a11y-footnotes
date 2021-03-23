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
  }, [idRef, idNote, description]); // It is not possible to update the React state on the server, still the
  // footnote references need to be registered so the footnotes can be rendered.
  // In that case, we mutate the state directly so the footnotes work with SSR.


  if (!footnotes.has(footnote.idRef)) {
    footnotes.set(footnote.idRef, footnote);
  } // Once the application mounts, the footnotes state has been emptied and we
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

exports.FootnoteRef = FootnoteRef;
FootnoteRef.propTypes = {
  description: _propTypes["default"].node.isRequired,
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
  }, references.map(function (_ref, index) {
    var idNote = _ref.idNote,
        idRef = _ref.idRef,
        description = _ref.description;
    return /*#__PURE__*/_react["default"].createElement(ListItem, {
      id: idNote,
      key: idNote,
      "data-a11y-footnotes-list-item": true,
      role: "doc-endnote"
    }, description, "\xA0", /*#__PURE__*/_react["default"].createElement(BackLink, {
      "data-a11y-footnotes-back-link": true,
      href: '#' + idRef,
      "aria-label": "Back to reference ".concat(index + 1),
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

  var _React$useState = _react["default"].useState(new Map()),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      footnotes = _React$useState2[0],
      setFootnotes = _React$useState2[1];

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
  }, [getBaseId]); // When JavaScript kicks in and the application mounts, reset the footnotes
  // store which was mutated by every reference.


  _react["default"].useEffect(function () {
    return setFootnotes(new Map());
  }, []);

  var register = _react["default"].useCallback(function (footnote) {
    setFootnotes(function (footnotes) {
      var clone = new Map(footnotes);
      if (!clone.has(footnote.idRef)) clone.set(footnote.ifRef, footnote);
      return clone;
    }); // Return a function which can be used to unregister the footnote. This
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

exports.FootnotesProvider = FootnotesProvider;
FootnotesProvider.defaultProps = {
  footnotesTitleId: 'footnotes-label'
};
