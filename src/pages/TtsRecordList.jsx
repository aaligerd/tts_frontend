import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TtsRecordList() {
  const [records, setRecords] = useState([]);
  const [pageLength, setPageLength] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/tts/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate || null,
          end_date: endDate || null,
          page_length: pageLength,
          page_number: pageNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecords(data.data || []);
        setTotalPages(data.pagination.total_pages || 1);
      } else {
        console.error("Error:", data.msg);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  const handleFilter = () => {
    setPageNumber(1);
    fetchRecords();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <Link
        to="/tts/upload"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
          background: "#2563eb",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        ➕ Add New TTS Record
      </Link>

      <h2 style={{ marginBottom: "15px" }}>TTS Records</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        &nbsp;&nbsp;
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        &nbsp;&nbsp;
        <button onClick={handleFilter}>Filter</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>TTS Text</th>
                <th>Audio URL</th>
                <th>QR URL</th>
                <th>TTS Time</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((rec,index) => {
                  const truncate = (str, len = 40) => {
                    if (!str) return "";
                    return str.length > len ? str.slice(0, len) + "..." : str;
                  };

                  return (
                    <tr key={index}>
                      <td>{rec.tts_id}</td>
                      <td title={rec.title}>{truncate(rec.title, 30)}</td>
                      <td title={rec.tts_text}>{truncate(rec.tts_text, 50)}</td>
                      <td>
                        <a
                          href={rec.audio_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Audio
                        </a>
                      </td>
                      <td>
                        <a href={rec.qr_url} target="_blank" rel="noreferrer">
                          QR
                        </a>
                      </td>
                      <td>{new Date(rec.tts_time).toLocaleString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => handlePageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
            >
              ⬅ Prev
            </button>
            <span style={{ margin: "0 15px" }}>
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TtsRecordList;
