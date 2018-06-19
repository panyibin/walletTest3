//
//  YBLoadingView.m
//  Pods-YBUtils_Example
//
//  Created by PanYibin on 2018/3/21.
//

#import "YBLoadingView.h"

@interface YBLoadingView ()

@property (nonatomic, strong) UIView *centerView; //animation background view
@property (nonatomic, strong) UIActivityIndicatorView *activityView; //animation view

@end

@implementation YBLoadingView

+ (instancetype)sharedView {
    static YBLoadingView *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[YBLoadingView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    });
    
    return _instance;
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
        self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        self.backgroundColor = [UIColor colorWithWhite: 0.8 alpha: 0.8];
    }
    return self;
}

- (UIView *)centerView {
    if (!_centerView) {
        _centerView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, 100, 100)];
        _centerView.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin;
        _centerView.center = self.center;
        _centerView.backgroundColor = [UIColor colorWithRed:51.0f/255.0f green:51.0f/255.0f blue:51.0f/255.0f alpha:1.0];
        _centerView.layer.cornerRadius = 10;
        [self addSubview: _centerView];
    }
    
    return _centerView;
}

- (UIActivityIndicatorView *)activityView {
    if (!_activityView) {
        _activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle: UIActivityIndicatorViewStyleWhiteLarge];
        _activityView.color = [UIColor whiteColor];
        _activityView.hidesWhenStopped = YES;
        [self.centerView addSubview: _activityView];
    }
    
    return _activityView;
}

+ (void)showInView:(UIView *)view {
    [[YBLoadingView sharedView] showInView:view];
}

+ (void)dismiss {
    [[YBLoadingView sharedView] dismiss];
}

- (void)showInView:(UIView*)view {
    [view addSubview:self];
    CGRect frame = CGRectMake(0, 0, view.frame.size.width, view.frame.size.height);
    self.frame = frame;
    
    self.centerView.center = self.center;
    CGPoint activityViewCenter = [self convertPoint:self.center toView:self.centerView];
    self.activityView.center = activityViewCenter;
    
    [self.activityView startAnimating];
    self.hidden = NO;
}

- (void)dismiss {
    [self removeFromSuperview];
    [self.activityView stopAnimating];
    self.hidden = YES;
}

@end
