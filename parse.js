export  {rip, combine}

function rip(obj, pattern)
{
    let syntax = pattern.map(item => parseSyntax(item))
    let patterns = syntax.map(item => parsePath(item, obj))

    const matches = patterns.flat()
    const requiredNames = syntax.filter(x=>!x.optional).map(x=>x.name)

    return combinePathsIntoObject(requiredNames, matches)

}
function combine(items, pattern)
{
    let syntax = pattern.map(item => parseSyntax(item))
    return  mapItemToPath(syntax, items)
}

function mapItemToPath(syntaxes, items)
{
    let result;
    let index = 0;
    for(const item of items)
    {
        for(const syntax of syntaxes)
        {
            result = insert(index, result, syntax.path, item[syntax.name])
        }
        index++
    }
    return result
}

function insert(index,old, path, value)
{
    let result;
    if(old)
    {
        result = old
    }
    else
    {
        if(path[0] == "*")
        {
            result = []
        }
        else
        {
            result = {}
        }
    }
    loop(result, 1)
    return result
    function loop(pointer, i)
    {
        if(i == path.length)
        {
            if(path[i-1] == "*")
            {
                pointer.push(value)
            }
            else
            {
                pointer[path[i-1]] = value
            }
            return
        }

        if(path[i-1] == "*")
        {
            if(path[i] == "*")
            {
                if(!pointer[index])
                {
                    pointer.push([])
                }
                loop(pointer[index], i+1)
            }
            else
            {
                if(!pointer[index])
                {
                    pointer.push({})
                }
                loop(pointer[index], i+1)
            }
        }
        else
        {
            if(path[i] == "*")
            {
                if(!pointer[path[i-1]])
                {
                    pointer[path[i-1]] = []
                }
                loop(pointer[path[i-1]], i+1)
            }
            else
            {
                if(!pointer[path[i-1]])
                {
                    pointer[path[i-1]] = {}
                }
                loop(pointer[path[i-1]], i+1)
            }
        }
    }
}


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
function parsePath({path, name}, obj)
{

    const matches = [];
    loop([], 0, obj);
    return matches;
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