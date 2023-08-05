export { getDefaultName }
function getDefaultName(path)
{
    var i = path.length - 1
    while(path[i] == "*" && i > 0)
    {
        i--
    }
    return path[i]
}