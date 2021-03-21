"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FootnotesProvider = exports.Footnotes = exports.FootnoteRef = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  }, [idRef, idNote, description]);

  if (!footnotes.current.find(function (fn) {
    return fn.idRef === footnote.ref;
  })) {
    footnotes.current.push(footnote);
  }

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
  if (footnotes.current.length === 0) return null;
  return /*#__PURE__*/_react["default"].createElement(Wrapper, {
    "data-a11y-footnotes-footer": true,
    role: "doc-endnotes"
  }, /*#__PURE__*/_react["default"].createElement(Title, {
    "data-a11y-footnotes-title": true,
    id: footnotesTitleId
  }), /*#__PURE__*/_react["default"].createElement(List, {
    "data-a11y-footnotes-list": true
  }, footnotes.current.map(function (_ref, index) {
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

  var footnotes = _react["default"].useRef([]);

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
