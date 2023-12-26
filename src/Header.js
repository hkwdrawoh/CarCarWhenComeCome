function Header() {
    return (
        <div className="menu">
            <nav>
                <h2>安泰邨 幾點有車？</h2>
                <button className="button_base back_index">主頁</button>
            </nav>
            <div className="clock">
                <div>
                    <h3 className="timenow">123</h3>
                    <p>現在時間</p>
                </div>
                <div>
                    <h3 className="timeref">456</h3>
                    <p>更新時間</p>
                </div>
                <button className="RefreshButton">更新</button>
            </div>
            <hr/>
        </div>
    );
}

export default Header;
