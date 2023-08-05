import { parsePath } from "./lib/parsePath"
import { parseSyntax } from './lib/parseSyntax'
import { combinePathsIntoObject } from "./lib/combinePathsIntoObject"
import { removeInvalidObjects } from "./lib/removeInvalidObjects"
export  default rip

function rip(obj, pattern)
{
    let syntax = pattern.map(item => parseSyntax(item))
    let patterns = syntax.map(item => parsePath(item, obj))

    const matches = patterns.flat()
    const requiredNames = syntax.filter(x=>!x.optional).map(x=>x.name)

    const result = combinePathsIntoObject(matches)

    return removeInvalidObjects(result,requiredNames);

}

