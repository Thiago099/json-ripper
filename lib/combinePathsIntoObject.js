import { Group } from "./group"
export { combinePathsIntoObject }
function combinePathsIntoObject(matches)
{
    let result = []
    loop({}, matches, 0)
    function loop(obj, items, i)
    {
        let groups = Group(items, i)
        let branchList = []
        let addList = []
        for(let [key, group] of Object.entries(groups))
        {
            let current = []

            if(isNumeric(key))
            {
                branchList.push(current)
            }
            else
            {
                addList.push(current)
            }

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
                loop(obj, group, i + 1)
            }
        }

        for(let group of branchList)
        {
            if(group.length > 0)
            {
                loop({...obj}, group, i + 1)
            }
        }
    }
    return result
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }