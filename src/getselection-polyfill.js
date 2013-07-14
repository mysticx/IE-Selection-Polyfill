(function (undefined) {
    if (document.selection && typeof window.getSelection === 'undefined') {

        var GetNodeText = function (node) {
            var result = undefined;
            if (node.innerText) {
                result = node.innerText;
            } else if (node.textContent) {
                result = node.innerText;
            } else if (node.nodeValue) {
                result = node.nodeValue;
            }
            
            return result;
        }

        var GetNodeIndex = function (child) {
            var i = 1;
            while ((child = child.previousSibling) != null)
                i++;

            return i;
        }

        var FindElementByPos = function (node, offset, result) {
            for (var i = 0; i < node.childNodes.length && !result.found; i++) {
                if (node.childNodes[i].nodeType == 3) {
                    if (offset <= GetNodeText(node.childNodes[i]).length + result.innerOffset) {
                        result.found = true;
                        result.innerOffset = offset - result.innerOffset;
                        result.element = node.childNodes[i];
                        break;
                    } else {
                        result.innerOffset += GetNodeText(node.childNodes[i]).length;
                    }
                } else if (node.childNodes[i].nodeType == 3) {
                    result.innerOffset += GetNodeText(node.childNodes[i]).length;
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
                Selection.Range.collapsed = Selection.ieRange.compareEndPoints('StartToEnd', Selection.ieRange) == 0 ? true : false;

                Selection.Range.commonAncestorContainer = Selection.ieRange.parentElement;

                // Rest are in CalculateOffsets method
            }

            function InitRangeMethods() {

                Selection.Range.setStart = function (startNode, startOffset) {
                    if (GetNodeText(startNode).length >= startOffset && startOffset >= 0) {
                        var tempRange = document.body.createTextRange();
                        tempRange.moveToElementText(startNode);
                        tempRange.moveStart('character', startOffset);
                        Selection.ieRange.setEndPoint('StartToStart', tempRange);
                        Selection.ieRange.select();
                    }
                }
                Selection.Range.setEnd = function (startNode, startOffset) {
                    if (GetNodeText(startNode).length >= startOffset && startOffset >= 0) {
                        var tempRange = document.body.createTextRange();
                        tempRange.moveToElementText(startNode);
                        tempRange.moveEnd('character', -(GetNodeText(startNode).length - startOffset + 1));
                        Selection.ieRange.setEndPoint('EndToEnd', tempRange);
                        Selection.ieRange.select();
                    }
                }
                Selection.Range.setStartBefore = function (node) {
                    if (node.parentNode && node.parentNode != null) {
                        Selection.Range.startContainer = node.parentNode;
                        Selection.Range.startOffset = GetNodeIndex(node);
                    } else {
                        throw new Error("InvalidNodeTypeError");
                    }
                }
                Selection.Range.setStartAfter = function () {
                    if (node.parentNode && node.parentNode != null) {
                        Selection.Range.startContainer = node.parentNode;
                        Selection.Range.startOffset = GetNodeIndex(node) + 1;
                    } else {
                        throw new Error("InvalidNodeTypeError");
                    }
                }
                Selection.Range.setEndBefore = function () {
                    if (node.parentNode && node.parentNode != null) {
                        Selection.Range.endContainer = node.parentNode;
                        Selection.Range.endOffset = GetNodeIndex(node);
                    } else {
                        throw new Error("InvalidNodeTypeError");
                    }
                }
                Selection.Range.setEndAfter = function () {
                    if (node.parentNode && node.parentNode != null) {
                        Selection.Range.endContainer = node.parentNode;
                        Selection.Range.endOffset = GetNodeIndex(node) + 1;
                    } else {
                        throw new Error("InvalidNodeTypeError");
                    }
                }
                Selection.Range.selectNode = function (node) {
                    if (node.parentNode && node.parentNode != null) {
                        Selection.Range.startContainer = node.parentNode;
                        Selection.Range.startOffset = GetNodeIndex(node);
                        Selection.Range.endContainer = node.parentNode;
                        Selection.Range.endOffset = GetNodeIndex(node) + 1;
                    } else {
                        throw new Error("InvalidNodeTypeError");
                    }
                }
                Selection.Range.selectNodeContents = function (node) {
                    Selection.ieRange.moveToElementText(node);
                }
                Selection.Range.collapse = function (toStart) {
                    if (toStart) {
                        Selection.ieRange.setEndPoint('EndToStart', Selection.ieRange);
                    } else {
                        Selection.ieRange.setEndPoint('StartToEnd', Selection.ieRange);
                    }
                }

                Range.cloneContents = function () {
    
                }

                Range.deleteContents = function () {
    
                }

                Range.extractContents = function () {
    
                }

                Range.insertNode = function () {
    
                }

                Range.surroundContents = function () {
    
                }

                Range.compareBoundaryPoints = function () {
    
                }
                Range.cloneRange = function () {
    
                }
                Range.detach = function () {
    
                }
                Range.toString = function () {

                }
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