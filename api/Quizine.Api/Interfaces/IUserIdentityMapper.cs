namespace Quizine.Api.Interfaces
{
    public interface IUserIdentityMapper<T>
    {
        void AddConnection(T userIdentity, string connectionId);
        void RemoveConnection(T userIdentity, string connectionId);
        bool UserConnected(T userIdentity);
    }
}