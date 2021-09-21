using NUnit.Framework;
using Quizine.Api.Interfaces;
using Quizine.Api.Services;
using Quizine.Api.Tests.Stubs;
using Quizine.Api.Tests.Utils;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizine.Api.Tests.Services
{
    [TestFixture]
    public class ResourceManagerServiceTests
    {
        private ResourceManagerService _service;
        private ISessionRepository _sessionRepository;

        [SetUp]
        public void Setup()
        {
            _sessionRepository = new SessionRepository(new ILoggerStub<SessionRepository>());
        }

        [TestCase(10000, 5000, 1000)]
        public async Task ShouldNotDisposeSession(int lifetime, int startedLifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(startedLifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            await Task.Delay(lifetime - pollInterval);

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Not.Null);
        }

        [TestCase(10000, 5000, 1000)]
        public async Task ShouldNotDisposeStartedSession(int lifetime, int startedLifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(startedLifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            _sessionRepository.StartSession(sessionParameters.SessionID);
            await Task.Delay(startedLifetime - pollInterval);

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Not.Null);
        }

        [TestCase(10000, 5000, 1000)]
        public async Task ShouldDisposeSession(int lifetime, int startedLifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(startedLifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            await Task.Delay(lifetime + pollInterval);

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Null);
        }

        [TestCase(10000, 5000, 1000)]
        public async Task ShouldDisposeStartedSession(int lifetime, int startedLifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(startedLifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            _sessionRepository.StartSession(sessionParameters.SessionID);
            await Task.Delay(startedLifetime + pollInterval);

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Null);
        }

        [TestCase(10000, 5000, 1000)]
        public async Task ShouldNotDisposeSessionAfterStartedLifetime(int lifetime, int startedLifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(startedLifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            await Task.Delay(startedLifetime);

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Not.Null);
        }
    }
}
