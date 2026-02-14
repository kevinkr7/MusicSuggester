export const AddSong = () => {
    return (
        <div>
            <h3>Post a New Track</h3>
            <form action="http://172.21.12.191:8080/songs" method="POST" encType="multipart/form-data">
                <input type="text" name="title" placeholder="Song Name" required />
                <input type="text" name="artist" placeholder="Artist" required />
                <input type="text" name="mood" placeholder="Mood (Happy, Chill, etc.)" required />
                <label style={{ fontSize: "0.8rem", color: "#b3b3b3" }}>Upload Audio File</label>
                <input type="file" name="file" accept="audio/*" required />
                <button type="submit">Upload Song</button>
            </form>
        </div>
    );
};