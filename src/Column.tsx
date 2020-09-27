import React, { useRef } from "react";
import { ColumnContainer, ColumnTitle } from "./styles";
import { AddNewItem } from "./AddNewItem";
import { useAppState } from "./useAppState";
import { Card } from "./Card";
import { useDrop } from "react-dnd";
import { useItemDrag } from "./useItemDrag";
import { DragItem } from "./DragItem";
import { isHidden } from "./utils/isHidden";

interface ColumnProps {
  text: string;
  index: number;
  id: string;
  isPreview?: boolean;
}

export const Column = ({ text, index, id, isPreview }: ColumnProps) => {
  const { state, dispatch } = useAppState();

  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (item: DragItem) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      dispatch({
        type: "MOVE_LIST",
        payload: {
          dragIndex,
          hoverIndex,
        },
      });
      item.index = hoverIndex;
    },
  });

  const { drag } = useItemDrag({
    id,
    text,
    index,
    type: "COLUMN",
  });

  drag(drop(ref));

  return (
    <ColumnContainer
      ref={ref}
      isHidden={isHidden(isPreview, state.draggedItem, "COLUMN", id)}
      isPreview={isPreview}
    >
      <ColumnTitle>{text}</ColumnTitle>
      {state.lists[index].tasks.map((task) => (
        <Card text={task.text} key={task.id} />
      ))}
      <AddNewItem
        onAdd={(task) => {
          console.log("add");
          dispatch({
            type: "ADD_TASK",
            payload: {
              text: task,
              listId: id,
            },
          });
        }}
        toggleButtonText={"+ Add another task"}
        dark
      />
    </ColumnContainer>
  );
};
