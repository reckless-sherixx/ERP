export async function downloadFile(url: string, filename: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = sanitizeFilename(filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
        
        return true;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file');
    }
}

// Removing invalid characters from the filename

function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9-_\.]/g, '_');
}

// Gets file extension from URL or falls back to default
export function getFileExtension(url: string, defaultExt = 'jpg'): string {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return defaultExt;
    
    // List of allowed extensions
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'svg'];
    return allowedExtensions.includes(extension) ? extension : defaultExt;
}