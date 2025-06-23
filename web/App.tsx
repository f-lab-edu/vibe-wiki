import React, {useEffect, useRef, useState} from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { v4 as uuidv4 } from 'uuid';
import { FaPen, FaEraser, FaUndo, FaRedo } from "react-icons/fa";

import { ENV } from './env';

type Tool = 'pen' | 'eraser' | 'select';
type LineData = {
  tool: Tool;
  points: number[];
};

type SelectionArea = {
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type PopupPosition = {
  x: number;
  y: number;
};

type MermaidOverlay = {
  id: string;
  code: string;
  area: SelectionArea;
};

export default function App() {
  const [tool, setTool] = useState<Tool>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const [undoStack, setUndoStack] = useState<LineData[][]>([]);
  const [redoStack, setRedoStack] = useState<LineData[][]>([]);
  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({ x: 0, y: 0 });
  const [mermaidOverlays, setMermaidOverlays] = useState<MermaidOverlay[]>([]);
  const [draggingOverlayId, setDraggingOverlayId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [model, setModel] = useState<'openai' | 'llama'>('openai');


  const isDrawing = useRef(false);
  const isSelecting = useRef(false);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
    if (draggingOverlayId === null) return;
      setMermaidOverlays((prev) =>
        prev.map((overlay) => {
        if (overlay.id !== draggingOverlayId) return overlay;
          const newX = e.clientX - dragOffset.current.x;
          const newY = e.clientY - dragOffset.current.y;
          return {
            ...overlay,
            area: {
              ...overlay.area,
              startX: newX,
              startY: newY,
            },
          };
        })
      );
    };

    const handleMouseUp = () => {
      setDraggingOverlayId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingOverlayId]);


  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === 'select') {
      isSelecting.current = true;
      setSelectionArea({
        startX: pos.x,
        startY: pos.y,
        width: 0,
        height: 0
      });
      setShowPopup(false);
    } else {
      isDrawing.current = true;
      setUndoStack((prev) => [...prev, lines]);
      setRedoStack([]); // Clear redo stack on new action
      setLines((prevLines) => [...prevLines, { tool, points: [pos.x, pos.y] }]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    if (tool === 'select' && isSelecting.current && selectionArea) {
      setSelectionArea({
        startX: selectionArea.startX,
        startY: selectionArea.startY,
        width: point.x - selectionArea.startX,
        height: point.y - selectionArea.startY
      });
    } else if (isDrawing.current) {
      setLines((prevLines) => {
        const newLines = [...prevLines];
        const lastLine = newLines[newLines.length - 1];
        lastLine.points = [...lastLine.points, point.x, point.y];
        newLines.splice(newLines.length - 1, 1, lastLine);
        return newLines;
      });
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool === 'select' && isSelecting.current && selectionArea) {
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (point) {
        const width = Math.abs(point.x - selectionArea.startX);
        const height = Math.abs(point.y - selectionArea.startY);
        if (width > 10 && height > 10) {
          setPopupPosition({
            x: selectionArea.startX + width,
            y: selectionArea.startY
          });
          setShowPopup(true);
        }
      }
    }
    isDrawing.current = false;
    isSelecting.current = false;
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

  const handlePopupAction = async (action: string) => {
    console.log(`Selected action: ${action}`);
    if (action === 'export') exportSelectionAsImage();
    else if (action === 'convert_to_flowchart') {
      const imageData = getSelectedImageData();
      if (imageData) {
        const fullResponse = await requestMermaidFromImage(imageData);
        console.log("Generated Mermaid Code:", fullResponse);
        const extracted = extractMermaidCode(fullResponse);
        console.log("Extracted Mermaid Code:\n", extracted);
        if (!extracted) {
          alert("Convert failed: No mermaid code found.");
          return;
        }
        removeLinesInSelection();
        setMermaidOverlays(prev => [
          ...prev,
          {
            id: uuidv4(),
            code: extracted,
            area: selectionArea!
          },
        ]);
      }
    }
    setShowPopup(false);
    setSelectionArea(null);
  };

  const handleOverlayMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    const overlay = mermaidOverlays.find((o) => o.id === id);
    if (!overlay) return;
    setDraggingOverlayId(id);
    dragOffset.current = {
      x: e.clientX - overlay.area.startX,
      y: e.clientY - overlay.area.startY,
    };
  };

  const extractMermaidCode = (text: string): string | null => {
    const match = text.match(/```mermaid\n([\s\S]*?)```/);
    return match ? match[1].trim() : null;
  };

  const removeLinesInSelection = () => {
    if (!selectionArea) return;
    setLines((prev) => prev.filter(line => {
      const points = line.points;
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        if (
          x >= selectionArea.startX &&
          x <= selectionArea.startX + selectionArea.width &&
          y >= selectionArea.startY &&
          y <= selectionArea.startY + selectionArea.height
        ) {
          return false;
        }
      }
      return true;
    }));
  };

  const exportSelectionAsImage = () => {
    if (!selectionArea || !stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      x: selectionArea.startX,
      y: selectionArea.startY,
      width: selectionArea.width,
      height: selectionArea.height,
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = 'selection.png';
    link.href = dataURL;
    link.click();
  };

  const getSelectedImageData = (): string | null => {
  if (!selectionArea || !stageRef.current) return null;
    return stageRef.current.toDataURL({
      x: selectionArea.startX,
      y: selectionArea.startY,
      width: selectionArea.width,
      height: selectionArea.height,
      pixelRatio: 2,
    });
  };

  const requestMermaidFromImage = async (imageData: string): Promise<string> => {
    const base64 = imageData.replace(/^data:image\/png;base64,/, '');
    const response = await fetch(`${ENV.API_BASE_URL}/api/generate-diagram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64,
        prompt: "Please analyze this image and convert it into a Mermaid-format flowchart.",
        model: model,
      }),
    });
    const { mermaid } = await response.json();
    return mermaid;
  };

  const renderMermaidHTML = (code: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
        <style>body { margin: 0; }</style>
      </head>
      <body>
        <div class="mermaid">
        ${code}
        </div>
        <script>mermaid.initialize({ startOnLoad: true });</script>
      </body>
    </html>`;

  return (
    <div style={{ position: 'relative' }}>
      <div style={styles.toolbar}>
        <button
          onClick={() => setTool('select')}
          style={{
            ...styles.toolButton,
            backgroundColor: tool === 'select' ? '#ddd' : '#fff',
          }}
          title="Select"
        >
          <span style={{ fontSize: '24px' }}>⬚</span>
        </button>
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

        <select
          value={model}
          onChange={(e) => setModel(e.target.value as 'openai' | 'llama')}
          style={{
            ...styles.toolButton,
            fontSize: '16px',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            padding: '6px 8px',
            borderRadius: 6,
          }}
          title="Select AI model"
        >
          <option value="openai">OpenAI GPT-4o</option>
          <option value="llama">LLaMA (SageMaker)</option>
        </select>

      </div>

      {showPopup && (
        <div style={{
          ...styles.popup,
          left: popupPosition.x,
          top: popupPosition.y,
        }}>
          <button onClick={() => handlePopupAction('export')}>Export as Image</button>
          <button onClick={() => handlePopupAction('convert_to_flowchart')}>Convert to Flowchart</button>
        </div>
      )}

      {mermaidOverlays.map((overlay, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: overlay.area.startX,
            top: overlay.area.startY,
            width: overlay.area.width,
            height: overlay.area.height,
            zIndex: 50,
          }}
          onMouseDown={(e) => handleOverlayMouseDown(e, overlay.id)} >
          <iframe
            srcDoc={renderMermaidHTML(overlay.code)}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              borderRadius: 8,
              pointerEvents: 'none',
              backgroundColor: 'white',
            }} />
        </div>
      ))}

      <Stage
        ref={stageRef}
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
          {selectionArea && (
            <Rect
              x={selectionArea.startX}
              y={selectionArea.startY}
              width={selectionArea.width}
              height={selectionArea.height}
              stroke="#000"
              strokeWidth={1}
              dash={[5, 5]}
              fill="rgba(0, 0, 255, 0.1)"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

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
  popup: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};
