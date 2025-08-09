import React from 'react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestModal({ isOpen, onClose }: TestModalProps) {
  if (!isOpen) return null;

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '8px',
        zIndex: 1001,
        display: 'flex'
      }}>
        {/* Left Column */}
        <div style={{
          width: '50%',
          backgroundColor: 'lightblue',
          padding: '20px',
          border: '2px solid red'
        }}>
          <h3>LEFT COLUMN</h3>
          <p>This should be exactly 50% width</p>
        </div>
        
        {/* Right Column */}
        <div style={{
          width: '50%',
          backgroundColor: 'lightgreen',
          padding: '20px',
          border: '2px solid blue'
        }}>
          <h3>RIGHT COLUMN</h3>
          <p>This should be exactly 50% width</p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          X
        </button>
      </div>
    </>
  );
}