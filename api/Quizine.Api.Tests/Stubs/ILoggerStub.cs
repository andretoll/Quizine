﻿using Microsoft.Extensions.Logging;
using System;

namespace Quizine.Api.Tests.Stubs
{
    public class ILoggerStub<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state) { return null; }

        public bool IsEnabled(LogLevel logLevel) { return false; }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) { }
    }
}
