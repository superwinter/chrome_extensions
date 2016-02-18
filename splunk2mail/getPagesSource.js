// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function extractEmails (text)
{
    return text.match(/\"email\"\:\"+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)+\"/g);
}
function extractName (text)
{
    return text.match(/\"name\"\:\"+[^\w\s]+\"/g);
}
function extractFeedback (text)
{
    return text.match(/\"feedback\"\:\"(.*)"\,/);
}

function sendmail(NAME, EMAIL, SUBJECT, MESSAGE) {
   var SUBJECT = '親愛的使用者 '+ NAME +' 您好';
   window.location.href = 'mailto:'+ EMAIL +'?subject='+SUBJECT+'&body='+MESSAGE; 
}

function DOMtoString(document_root) {
    var html = '';
    var FEEDBACK = '';
    var node = '';
    node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    var NAME = extractName(html);
    var EMAIL = extractEmails(html);
    FEEDBACK = extractFeedback(html);
    NAME = NAME[0].replace(/\"/g,"").replace(/\,/g,"").replace(/name\:/g,""); 
    EMAIL = EMAIL[0].replace(/\"/g,"").replace(/\,/g,"").replace(/email\:/g,""); 
    SUBJECT = '親愛的使用者 '+ NAME +' 您好';
    var TITLE = '超級商城團隊APP上';  
    var BODY = '>>>>>' + encodeURI(FEEDBACK[1]) + encodeURI('\r\n\r\n\r\n') + encodeURI(TITLE); 
    sendmail(NAME, EMAIL, SUBJECT, BODY); 
}

chrome.runtime.restart({
    action: "getSource",
    source: DOMtoString(document)
});
