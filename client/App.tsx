import React, {useRef, useState} from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { FaPen, FaEraser, FaUndo, FaRedo } from "react-icons/fa";

type Tool = 'pen' | 'eraser';
type LineData = {
  tool: Tool;
  points: number[];
};

export default function App() {
  const [tool, setTool] = useState<Tool>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const [undoStack, setUndoStack] = useState<LineData[][]>([]);
  const [redoStack, setRedoStack] = useState<LineData[][]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      return;
    }

    setUndoStack((prev) => [...prev, lines]);
    setRedoStack([]); // Clear redo stack on new action

    setLines((prevLines) => [...prevLines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    
    if(!point) return;

    setLines((prevLines) => {
      const newLines = [...prevLines];
      const lastLine = newLines[newLines.length - 1];
      lastLine.points = [...lastLine.points, point.x, point.y];
      newLines.splice(newLines.length - 1, 1, lastLine);
      return newLines
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = [...undoStack];
    const last = prev.pop();
    setUndoStack(prev);
    setRedoStack((prevRedos) => [...prevRedos, lines]);
    if (last) setLines(last);
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const prev = [...redoStack];
    const last = prev.pop();
    setRedoStack(prev);
    setUndoStack((prevUndos) => [...prevUndos, lines]);
    if (last) setLines(last);
  }


  return (
    <div style={{ position: 'relative' }}>
      {/* 툴바 */}
      <div style={styles.toolbar}>
        <button
          onClick={() => setTool('pen')}
          style={{
            ...styles.toolButton,
            backgroundColor: tool === 'pen' ? '#ddd' : '#fff',
          }}
          title="Pen"
        >
          <FaPen size={24} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          style={{
            ...styles.toolButton,
            backgroundColor: tool === 'eraser' ? '#ddd' : '#fff',
          }}
          title="Eraser"
        >
          <FaEraser size={24} />
        </button>
        <button onClick={handleUndo} style={styles.toolButton} title="Undo">
          <FaUndo size={24} />
        </button>
        <button onClick={handleRedo} style={styles.toolButton} title="Redo">
          <FaRedo size={24} />
        </button>
      </div>

      {/* 캔버스 */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#3b82f6"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  toolbar: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: '6px 12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
    alignItems: 'center',
  },
  toolButton: {
    padding: '6px 10px',
    fontSize: '18px',
    border: '1px solid #ccc',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: '#fff',
  },
};
