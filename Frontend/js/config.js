if (!window.API_BASE_URL) {
    const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (!isHttp) {
        window.API_BASE_URL = "http://localhost:5000/api";
    } else if (isLocalHost && window.location.port !== "5000") {
        window.API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
    } else {
        window.API_BASE_URL = `${window.location.origin}/api`;
    }
}

export const API_BASE_URL = window.API_BASE_URL;
