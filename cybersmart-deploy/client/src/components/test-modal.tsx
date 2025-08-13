import React from 'react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestModal({ isOpen, onClose }: TestModalProps) {
  if (!isOpen) return null;

  console.log("TEST MODAL RENDERING - Should show 2 columns side by side");

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000
        }}
        onClick={onClose}
      />
      
      {/* Modal Container - FORCE HORIZONTAL LAYOUT */}
      <div 
        id="test-modal-container"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '1000px',
          height: '70vh',
          maxHeight: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          zIndex: 10001,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          border: '3px solid #ff0000',
          display: 'flex !important',
          flexDirection: 'row !important',
          overflow: 'hidden'
        }}
      >
        {/* Left Column - BRIGHT COLORS FOR VISIBILITY */}
        <div 
          id="left-column"
          style={{
            width: '50%',
            minWidth: '50%',
            maxWidth: '50%',
            backgroundColor: '#00BFFF',
            padding: '30px',
            border: '5px solid #FF0000',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}
        >
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            backgroundColor: '#FF0000',
            padding: '10px',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            LEFT COLUMN
          </h2>
          <p style={{ fontSize: '18px', color: '#000' }}>
            This column should be exactly 50% width.
          </p>
          <p style={{ fontSize: '16px', color: '#000' }}>
            Background: Blue (#00BFFF)<br/>
            Border: Red (5px)<br/>
            Width: 50%
          </p>
        </div>
        
        {/* Right Column - BRIGHT COLORS FOR VISIBILITY */}
        <div 
          id="right-column"
          style={{
            width: '50%',
            minWidth: '50%',
            maxWidth: '50%',
            backgroundColor: '#32CD32',
            padding: '30px',
            border: '5px solid #0000FF',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}
        >
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            backgroundColor: '#0000FF',
            padding: '10px',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            RIGHT COLUMN
          </h2>
          <p style={{ fontSize: '18px', color: '#000' }}>
            This column should be exactly 50% width.
          </p>
          <p style={{ fontSize: '16px', color: '#000' }}>
            Background: Green (#32CD32)<br/>
            Border: Blue (5px)<br/>
            Width: 50%
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#FF0000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 10002
          }}
        >
          CLOSE X
        </button>
      </div>
    </>
  );
}