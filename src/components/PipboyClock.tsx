"use client";

import React, { useState, useEffect } from "react";

export const PipboyClock: React.FC = () => {
  const [timeHour, setTimeHour] = useState("08");
  const [timeMinute, setTimeMinute] = useState("40");
  const [dateStr, setDateStr] = useState("02.23.2026");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const year = now.getFullYear();

      setTimeHour(hours);
      setTimeMinute(minutes);
      setDateStr(`${month}.${day}.${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pipboy-wrapper">
      <input type="radio" id="tab-stat" name="pip-tabs" defaultChecked />
      <input type="radio" id="tab-inv" name="pip-tabs" />
      <input type="radio" id="tab-data" name="pip-tabs" />

      <div className="pipboy-chassis">
        <div className="screw tl"></div>
        <div className="screw tr"></div>
        <div className="screw bl"></div>
        <div className="screw br"></div>

        <div className="crt-screen">
          <div className="screen-glass"></div>
          <div className="scanlines"></div>

          <div className="boot-sequence">
            <header className="top-bar">
              <div className="dynamic-title flicker-text"></div>
              <div className="line flexible"></div>
              <div className="stats-info">
                <span>HP <span className="bold">348/450</span></span>
                <span>AP <span className="bold">67/67</span></span>
                <span className="pulse-icon">⚡</span>
              </div>
            </header>

            <main className="middle-section">
              <div className="tab-content content-stat">
                <aside className="side-menu">
                  <div>CND</div>
                  <div>RAD</div>
                  <div>EFF</div>
                  <div className="active-box-static">CLK</div>
                </aside>

                <section className="clock-display">
                  <div className="terminal-block">
                    <div className="time">
                      {timeHour}
                      <span className="blink-colon">:</span>
                      {timeMinute}
                    </div>
                  </div>
                  <div className="date">{dateStr}</div>
                </section>

                <aside className="right-menu">
                  <div className="hazard-symbol">
                    <div className="hazard-core"></div>
                  </div>
                  <div className="rad-text">RADS</div>
                </aside>
              </div>

              <div className="tab-content content-inv">
                <ul className="inventory-list">
                  <li>
                    <span className="item-name">Stimpak (12)</span>
                    <span className="item-wgt">WGT 0.5</span>
                  </li>
                  <li className="active-terminal-line">
                    <span className="item-name">10mm Pistol</span>
                    <span className="item-wgt">WGT 4.0</span>
                  </li>
                  <li>
                    <span className="item-name">Nuka-Cola Quantum</span>
                    <span className="item-wgt">WGT 1.0</span>
                  </li>
                  <li>
                    <span className="item-name">RadAway (5)</span>
                    <span className="item-wgt">WGT 0.5</span>
                  </li>
                  <li>
                    <span className="item-name">Power Armor Core</span>
                    <span className="item-wgt">WGT 3.0</span>
                  </li>
                </ul>
              </div>

              <div className="tab-content content-data">
                <div className="radar-container">
                  <span></span>
                  <div className="blip"></div>
                </div>
                <div className="radar-text flicker-fast">SEARCHING SATELLITE...</div>
              </div>
            </main>

            <footer className="bottom-bar">
              <label htmlFor="tab-stat" className="nav-item">STAT</label>
              <div className="line flexible"></div>
              <label htmlFor="tab-inv" className="nav-item">INV</label>
              <div className="line flexible"></div>
              <label htmlFor="tab-data" className="nav-item">DATA</label>
              <div className="line flexible"></div>

              <div className="radio-visualizer">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
                <div className="bar bar-4"></div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
