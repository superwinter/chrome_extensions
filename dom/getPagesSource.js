// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function extractEmails (text)
{
    return text.match(/\"email\"\:\"+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)+\"/gi);
}
function extractName (text)
{
    return text.match(/\"name\"\:\"+[^\w\s]+\"/gi);
}
function extractFeedback (text)
{
    return text.match(/\"feedback\"\:\"+[^\w\s]+\"/gi);
}
function DOMtoString(document_root) {
    var html = '',
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
    var FEEDBACK = extractFeedback(html);
    NAME = NAME[0].replace(/\"/g,"").replace(/\,/g,"").replace(/name\:/g,""); 
    EMAIL = EMAIL[0].replace(/\"/g,"").replace(/\,/g,"").replace(/email\:/g,""); 
    
    var EMAILTO = '<html><head><meta http-equiv=\"Cache-Control\" content=\"no-store\"/><meta http-equiv=\"Pragma\" content=\"no-cache\"/><meta http-equiv=\"Expires\" content=\"0\"/></head><body><form action=\"mailto:admin@example.com\" enctype=\"text/plain\" method=\"post\">';
        EMAILTO +='<p>Name: <input name=\"Name\" type=\"text\" id=\"Name\" size=\"40\" value=\"'+ NAME +'\"></p>';
        EMAILTO +='<p>E-mail address: <input name=\"E-mail\" type=\"text\" id=\"E-mail\" size=\"40\" value=\"'+ EMAIL +'\"></p>';
        EMAILTO +='<p>Comment:</p>';
        EMAILTO +='<p><textarea name=\"Comment\" cols=\"55\" rows=\"5\" id=\"Comment\">'+ FEEDBACK +'</textarea></p>';
        EMAILTO +='<p><input type=\"submit\" name=\"Submit\" value=\"Submit\"></p></form></body></html>';
    var newWindow = window.open('', '_blank', 'location=yes', 'clearcache=yes');
    newWindow.document.write(EMAILTO);
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
