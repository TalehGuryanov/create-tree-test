import {memo, useState, useCallback} from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {TTree} from "../../types";
import './TreeNode.css'
import {ADD_ACTION, DELETE_ACTION, RENAME_ACTION} from "../../constants";

type TreeNodeProps = {
  node: TTree;
  onClick: (node: TTree, action: string) => void;
};

const TreeNode = ({node, onClick}: TreeNodeProps) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  
  const handleToggle = useCallback(() => {
    setIsOpenDropDown(prev => !prev);
  }, []);

  return (
    <div className="node">
      <div className="node-parent">
        {node.children.length > 0 && <button onClick={handleToggle}>
          {isOpenDropDown ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
        </button>}
        <span>{node.name}</span>
        <div className="node-actions">
          <button onClick={onClick.bind(null, node, ADD_ACTION)}><AddIcon/></button>
          <button onClick={onClick.bind(null, node, DELETE_ACTION)}><ClearIcon/></button>
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
