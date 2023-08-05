export { Group }
function Group(columns, i)
{
    let result = {};
    for (let column of columns)
    {
        let currentKey = column.path[i];
        if(currentKey == null) continue
        if (!(currentKey in result))
        {
            result[currentKey] = []
        }
        result[currentKey].push(column);
    }
    return result;
}