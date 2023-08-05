import { getDefaultName } from "./getDefaultName";
export { parseSyntax }
function parseSyntax(item)
{
    let separatedAlias = item.split(':');
    let path = separatedAlias[0]
    let optional = false
    if(path[0] == "?")
    {
        path = path.substring(1)
        optional = true
    }
    path = path.split('/')
    let name = separatedAlias.length == 2 ? separatedAlias[1] : getDefaultName(path);
    return {path, name, optional}
}