import {memo, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {TTree} from "../../types";
import './TreeNode.css'
import {ADD_ACTION, REMOVE_ACTION, RENAME_ACTION} from "../../constants";

type TreeNodeProps = {
  node: TTree;
  onClick: (node: TTree, action: string) => void;
}

const TreeNode = ({node, onClick}: TreeNodeProps) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  return (
    <div className="node">
      <div className="node-parent">
        <button onClick={() => setIsOpenDropDown(!isOpenDropDown)}>
          {isOpenDropDown ? <ArrowDropUpIcon /> :  <ArrowDropDownIcon/>}
        </button>
        <span>{node.name}</span>
        <div className="node-actions">
          <button onClick={onClick.bind(null, node, ADD_ACTION)}><AddIcon/></button>
          <button onClick={onClick.bind(null, node, REMOVE_ACTION)}><ClearIcon/></button>
          <button onClick={onClick.bind(null, node, RENAME_ACTION)}><ModeEditIcon/></button>
        </div>
      </div>
      {isOpenDropDown && <div className="node-child">
        {node.children.map((child) => (
          <TreeNode
              key={child.id}
              node={child}
              onClick={onClick}
          />
        ))}
      </div>}
    </div>
  )
}

export default memo(TreeNode);
