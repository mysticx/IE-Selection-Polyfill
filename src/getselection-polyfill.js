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
            
            function InitSelectionMembers() {
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
    
                }

                //TODO
                Selection.toString = function () {
    
                }

                //TODO
                Selection.containsNode = function () {
    
                }            

            }

            function InitRangeMembers() {

            }
            







            return Selection;
        }

        window.getSelection = getSelection;
        document.getSelection = getSelection;
    }
})()