export { parsePath }
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