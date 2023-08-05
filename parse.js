export default parse

function parse(obj, pattern)
{
    let patterns = pattern.map(item => parsePath(item, obj))

    const matches = patterns.map(x => x.matches).flat()
    const requiredNames = patterns.filter(x=>!x.pattern.optional).map(x=>x.pattern.name)
    
    return combinePathsIntoObject(requiredNames, matches)
}

function parsePath(item, obj)
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


    const matches = [];
    loop([], 0, obj);
    return {matches, pattern:{name, optional}};
    function loop(keys,i,obj)
    {

        if (obj == null)
        {
            return;
        }
        
        if (i == path.length)
        {
            matches.push({
                data: obj,
                path: keys,
                name,
                optional
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

function combinePathsIntoObject(requiredNames, matches)
{
    let result = [];
    loop({}, matches, 0);
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
                }
                else
                {
                    current.push(item);
                }
            }
        }
        if(requiredNames.every(x=>Object.keys(obj).includes(x)))
        {
            result.push({...obj});
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