import type { Subscription } from "prismatix-input/types";
import { positionRipple } from "./input";
import { copyModel, getRootMesh, setModelPosition } from "~/lib/babylon/mdl";
import { Tween } from "@tweenjs/tween.js";
import { tweenGroup } from "~/lib/update/cycle";

let dropStarSubscription: Subscription | undefined = undefined;
let hoshiCount = 0;
export function enableDropStar(){
    dropStarSubscription?.unsubscribe();
    dropStarSubscription = positionRipple.subscribe(_ => {
        // const x = e.x / inputArea.offsetWidth * 5 - 2.5;
        // const y = e.y / inputArea.offsetHeight * 5 - 1.5;

        const mdlName = copyModel("hoshi-mk", hoshiCount.toString());        
        if(!mdlName) return;

        hoshiCount++;
        const rootMesh = getRootMesh(mdlName);
        setModelPosition(mdlName, -2.5, 5, 0);
        const mdlTween = new Tween({y: 5}).to({y: -2}, 2000).start().onUpdate(e => {
            rootMesh.position.y = e.y;
        }).onComplete(()=>{
            tweenGroup.remove(mdlTween)
        });
        tweenGroup.add(mdlTween);
    });
}

export function disableDropStar(){
    dropStarSubscription?.unsubscribe();
}