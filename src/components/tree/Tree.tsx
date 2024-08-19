import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

import AppModal from "../appModal/AppModal";
import TreeNode from "../treeNode/TreeNode";
import { sendPostRequest } from "../../utils/api";
import {
  ADD_ACTION,
  API_USER_TREE_GET,
  API_USER_TREE_NODE_CREATE,
  API_USER_TREE_NODE_DELETE,
  API_USER_TREE_NODE_RENAME, DELETE_ACTION, RENAME_ACTION,
  TREE_NAME,
} from "../../constants";
import { TTree } from "../../types";

const Tree = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tree, setTree] = useState<TTree | null>(null);
  const [selectedNode, setSelectedNode] = useState<TTree | null>(null);
  const [action, setAction] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const fetchTree = async () => {
    try {
      const data = await sendPostRequest(API_USER_TREE_GET, {
        treeName: TREE_NAME,
      });
      setTree(data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };
  
  useEffect(() => {
    fetchTree();
  }, []);
  
  const nodeClickHandler = useCallback((node: TTree, action: string) => {
    setAction(action);
    setSelectedNode(node);
    setIsOpenModal(true);
  }, []);
  
  const handleNodeAction = useCallback(async (url: string, queryParams: Record<string, any>) => {
    try {
      await sendPostRequest(url, queryParams);
      await fetchTree();
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error('Request failed:', error);
    } finally {
      setIsOpenModal(false);
    }
  }, []);
  
  const submitHandler = useCallback(() => {
    if (!selectedNode) return;
    
    const nodeName = inputRef.current?.value.trim();
    if (!nodeName && action !== DELETE_ACTION) {
      alert('Please enter a value');
      return;
    }
    
    switch (action) {
      case ADD_ACTION: {
        const queryParams = {
          treeName: TREE_NAME,
          parentNodeId: selectedNode.id,
          nodeName
        };
        handleNodeAction(API_USER_TREE_NODE_CREATE, queryParams);
      }
        break;
      case DELETE_ACTION: {
        if(selectedNode.children.length > 0) {
          alert('You have to delete all children nodes first');
        } else {
          const queryParams = {
            treeName: TREE_NAME,
            nodeId:  selectedNode.id,
          }
          handleNodeAction(API_USER_TREE_NODE_DELETE, queryParams);
        }
      }
        break;
      case RENAME_ACTION: {
        const queryParams = {
          treeName: TREE_NAME,
          nodeId:  selectedNode.id,
          newNodeName:  nodeName,
        };
        handleNodeAction(API_USER_TREE_NODE_RENAME, queryParams);
      }
        break;
      default:
        break;
    }
  }, [action, selectedNode, handleNodeAction]);
  
  return (
    <div>
      {tree && (
        <TreeNode
            node={tree}
            onClick={nodeClickHandler}
        />
      )}
      {isOpenModal && (
        <AppModal
            isOpen={isOpenModal}
            handleClose={() => setIsOpenModal(false)}
        >
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {action}
            </Typography>
            {action === DELETE_ACTION ? (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Do you want to delete {selectedNode?.name}?
              </Typography>
            ) : (
              <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  placeholder="Node name"
                  inputRef={inputRef}
                  fullWidth={true}
              />
            )}
          </Box>
          <Box justifyContent="flex-end" display="flex">
            <Button variant="text" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
            <Button variant="text" onClick={submitHandler}>
              {action}
            </Button>
          </Box>
        </AppModal>
      )}
    </div>
  );
};

export default memo(Tree);
