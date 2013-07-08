(function (undefined) {
    if (document.selection && typeof window.getSelection === 'undefined') {
        var FindElementByPos = function (node, offset, result) {
            for (var i = 0; i < node.childNodes.length && !result.found; i++) {
                if (node.childNodes[i].nodeType == 3) {
                    if (offset <= $(node.childNodes[i]).text().length + result.innerOffset) {
                        result.found = true;
                        result.innerOffset = offset - result.innerOffset;
                        result.element = node.childNodes[i];
                        break;
                    } else {
                        result.innerOffset += node.childNodes[i].length;
                    }
                } else if (node.childNodes[i].nodeType == 3) {
                    result.innerOffset += $(node.childNodes[i]).text().length;
                } else {
                    FindElementByPos(node.childNodes[i], offset, result);
                }
            }
        }

        var getSelection = function () {

            select = document.selection;
            var range = select.createRange();
            var Selection = {};
            Selection.Text = range.text;
            Selection.Range = {};
            Selection.ieRange = range;
            
            function CalculateOffsets() {
                var sRange = range.duplicate();
                sRange.setEndPoint('EndToStart', range);
                sRange.moveToElementText(sRange.parentElement());
                sRange.setEndPoint('EndToStart', range);
                var startOffset = sRange.text.length == 0 ? 0 : sRange.text.length;
                var elemResult = {};
                elemResult.innerOffset = 0;
                FindElementByPos(sRange.parentElement(), startOffset, elemResult);
                Selection.Range.startOffset = elemResult.innerOffset;
                Selection.Range.startContainer = elemResult.element;

                sRange = range.duplicate();
                sRange.setEndPoint('StartToEnd', range);
                sRange.moveToElementText(sRange.parentElement());
                sRange.setEndPoint('EndToEnd', range);
                var endOffset = sRange.text.length == 0 ? 0 : sRange.text.length;
                elemResult = {};
                elemResult.innerOffset = 0;
                FindElementByPos(sRange.parentElement(), endOffset, elemResult);

                Selection.Range.endContainer = elemResult.element;
                Selection.Range.endOffset = elemResult.innerOffset;
            }
            

            function InitSelectionProperties() {

                Selection.anchorNode = Selection.Range.startContainer;

                Selection.anchorOffset = Selection.Range.startOffset;

                Selection.focusNode = Selection.Range.endContainer;

                Selection.focusOffset = Selection.Range.endOffset;

                Selection.isCollapsed = Selection.ieRange.compareEndPoints('StartToEnd', Selection.ieRange) == 0 ? true : false;

                // Temporary, until I support multiple ranges.
                Selection.rangeCount = 1;
            }
            function InitSelectionMethods() {
                // Currently the polyfill does not support getting specific ranges
                Selection.getRangeAt = function (index) {
                    return Selection.Range;
                }

                // Collapses the selection by folding the selection to it's end.
                Selection.collapse = function () {
                    Selection.ieRange.setEndPoint('StartToEnd', Selection.ieRange);
                }

                //TODO
                Selection.extend = function (parentNode, offset) {
                    
                }

                Selection.collapseToStart = function () {
                    Selection.ieRange.setEndPoint('EndToStart', Selection.ieRange);
                }

                Selection.collapseToEnd = function () {
                    Selection.ieRange.setEndPoint('StartToEnd', Selection.ieRange);
                }

                // TODO
                Selection.selectAllChildren = function () {
    
                }                

                //TODO
                Selection.addRange = function () {
    
                }

                //TODO
                Selection.removeRange = function () {
    
                }

                //TODO
                Selection.removeAllRanges = function () {
    
                }

                //TODO
                Selection.deleteFromDocument = function () {
                    Selection.ieRange.text = '';
                }

                //TODO
                Selection.toString = function () {
                    return Selection.Text;
                }

                // Check if node is contained. First we check with the ieRange if the range in question is already inside.
                // If we are interested about it being partially connected, we compare the start and end points.
                Selection.containsNode = function (aNode, aPartlyContained) {
                    var result = false;
                    // check if aNode is a node element
                    if (typeof aNode.nodeName != 'undefined') {
                        var aRange = document.body.createTextRange();
                        aRange.moveToElementText(aNode);

                        if (Selection.ieRange.inRange(aRange)) {
                            result = true;
                        } else if (aPartlyContained == true) {
                            if (Selection.ieRange.compareEndPoints('StartToEnd', aRange) == -1 && 
                                Selection.ieRange.compareEndPoints('StartToStart', aRange) != -1) {
                                result = true;
                            } else if (Selection.ieRange.compareEndPoints('EndToStart', aRange) != -1 &&
                                Selection.ieRange.compareEndPoints('EndToEnd', aRange) == -1) {
                                result = true;
                            }
                        }                        
                    }
                    return result;
                }            

            }

            function InitRangeProperties() {

            }
            function InitRangeMethods() {
                Selection.Range.collapsed = Selection.ieRange.compareEndPoints('StartToEnd', Selection.ieRange) == 0 ? true : false;

                Selection.Range.commonAncestorContainer = Selection.ieRange.parentElement;
            }

            
            CalculateOffsets();
            InitSelectionProperties();
            InitSelectionMethods();

            InitRangeProperties();
            InitRangeMethods();

            return Selection;
        }

        window.getSelection = getSelection;
        document.getSelection = getSelection;
    }
})()