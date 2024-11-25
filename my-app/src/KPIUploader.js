import React from 'react';

function KPIUploader({
    // ... existing props ...
    isJoinModalOpen,
    setIsJoinModalOpen,
    selectedJoinType,
    setSelectedJoinType,
    firstTable,
    setFirstTable,
    secondTable,
    setSecondTable,
    selectedCommonColumn,
    setSelectedCommonColumn,
    joinTypes,
    handleJoinSubmit,
    tableNames,
    commonColumns
}) {
    // ... existing code ...

    return (
        <div>
            {/* ... existing code ... */}
            {isJoinModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsJoinModalOpen(false)}>&times;</span>
                        <h3>Select Tables and Join Type</h3>
                        <div>
                            <label>First Table:</label>
                            <select value={firstTable} onChange={(e) => setFirstTable(e.target.value)}>
                                <option value="">Select a table</option>
                                {tableNames.map((table) => (
                                    <option key={table} value={table}>{table}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Second Table:</label>
                            <select value={secondTable} onChange={(e) => setSecondTable(e.target.value)}>
                                <option value="">Select a table</option>
                                {tableNames.map((table) => (
                                    <option key={table} value={table}>{table}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Common Column:</label>
                            <select value={selectedCommonColumn} onChange={(e) => setSelectedCommonColumn(e.target.value)}>
                                <option value="">Select a common column</option>
                                {commonColumns.map((column) => (
                                    <option key={column} value={column}>{column}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Join Type:</label>
                            <select value={selectedJoinType} onChange={(e) => setSelectedJoinType(e.target.value)}>
                                {joinTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleJoinSubmit}>Submit</button>
                        <button onClick={() => setIsJoinModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {/* ... existing code ... */}
        </div>
    );
}

export default KPIUploader; 