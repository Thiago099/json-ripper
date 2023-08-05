export { getDefaultName }
function getDefaultName(path)
{
    let i = path.length - 1
    while(path[i] == "*" && i > 0)
    {
        i--
    }
    return path[i]
}