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

        [TestCase(6000, 1000)]
        [TestCase(3000, 500)]
        public async Task ShouldNotDisposeSession(int lifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            await Task.Delay(lifetime - (pollInterval * 2));

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Not.Null);
        }

        [TestCase(6000, 1000)]
        [TestCase(3000, 500)]
        public async Task ShouldDisposeSession(int lifetime, int pollInterval)
        {
            // Arrange
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMilliseconds(lifetime), TimeSpan.FromMilliseconds(pollInterval));
            _service = new ResourceManagerService(parameters, _sessionRepository, new ILoggerStub<ResourceManagerService>());
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            await _service.StartAsync(new CancellationToken());
            _sessionRepository.AddSession(sessionParameters, TestData.GetRandomQuizItems(5));
            await Task.Delay(lifetime + (pollInterval * 2));

            // Assert
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionParameters.SessionID), Is.Null);
        }
    }
}
