export default parse

function parse(obj, pattern)
{
    let items = pattern.map(item => parsePath(item, obj)).flat()
    return combinePathsIntoObject(items, pattern)
}

function parsePath(item, obj)
{
    let separatedAlias = item.split(':');
    let path = separatedAlias[0].split('/');
    let name = separatedAlias.length == 2 ? separatedAlias[1] : getDefaultName(path);


    const result = [];
    loop([], 0, obj);
    return result;
    function loop(keys,i,obj)
    {

        if (obj == null)
        {
            return;
        }
        
        if (i == path.length)
        {
            result.push({
                data: obj,
                path: keys,
                name
            });
            return;
        }


        if (path[i] == "*")
        {
            let j = 0;
            for (let item of obj)
            {
                loop([...keys, j], i + 1, item);
                j++;
            }
        }
        else
        {
            loop([...keys, path[i]], i + 1, obj[path[i]]);
        }
    }
}

function getDefaultName(path)
{
    var i = path.length - 1
    while(path[i] == "*" && i > 0)
    {
        i--
    }
    return path[i]
}

function combinePathsIntoObject(columns, query)
{
    let result = [];
    loop({}, columns, 0);
    function loop(obj, items, i)
    {
        let groups = Group(items, i);
        let addList = [];
        for(let group of Object.values(groups))
        {
            let current = [];
            addList.push(current)
            for(let item of group)
            {
                if (item.path.length == i + 1)
                {
                    obj[item.name] = item.data;
                    if(Object.keys(obj).length == query.length)
                    {
                        result.push({...obj});
                    }
                }
                else
                {
                    current.push(item);
                }
            }
        }
        for(let group of addList)
        {

            if(group.length > 0)
            {
                loop({...obj}, group, i + 1);
            }
        }
    }
    return result;
}

function Group(columns, i)
{
    let result = {};
    for (let column of columns)
    {
        let currentKey = column.path[i];
        if (!(currentKey in result))
        {
            result[currentKey] = []
        }
        result[currentKey].push(column);
    }
    return result;
}