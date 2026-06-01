package app.backend.DTOs;

public class Response<T> { 
    private boolean success;
    private String message;
    private T data;         

    public Response(boolean success, String message, T data) {
        this.success = success;
        this.message = message;;
        this.data = data;
    }

    // Các hàm static helper giúp tạo nhanh response (Tiện cực kỳ!)
    public static <T> Response<T> ok(String message, T data) {
        return new Response<>(true, message, data);
    }

    public static <T> Response<T> fail(String message) {
        return new Response<>(false, message, null);
    }

    // Getters & Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}