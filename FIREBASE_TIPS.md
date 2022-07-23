## 1
http://json2ts.com/
Convert JSON files to typescrip objects

## 2
USE Partial<Question> instead of optional parameters (using ?) in case the optional parameter is
not always available in the object

## 3

Use union types instead of enums

export type GameInputPad = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

## 4
?? operators instead of null check

a= value || 'some deafault value'
0, NaN and "" are falsy values and default value will be assigned in these cases

a = value ?? 'some defau;t value'

## 5
Problem Verbose Imports
import {something} from '../../../../shared/shared.service';

Solution
import something from shared/shared.service
but make an entry for shared path in tsconfig.base.json file

"paths":{
    "shared":[
        "shared"
    ],
    "shared/*":[
        "shared/*"
    ]
}