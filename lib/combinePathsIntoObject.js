import { Group } from "./group"
export { combinePathsIntoObject }
function combinePathsIntoObject(matches)
{
    let result = []
    loop({}, matches, 0)
    function loop(obj, items, i)
    {
        let groups = Group(items, i)
        let addList = []
        for(let group of Object.values(groups))
        {
            let current = []
            addList.push(current)
            for(let item of group)
            {
                if (item.path.length == i + 1)
                {
                    obj[item.name] = item.data
                    result.push({...obj})
                }
                else
                {
                    current.push(item)
                }
            }
        }
        for(let group of addList)
        {
            if(group.length > 0)
            {
                loop({...obj}, group, i + 1)
            }
        }
    }
    return result
}